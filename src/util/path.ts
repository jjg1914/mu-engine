export interface PathVertex {
  interpolate: "polar" | "polynomial" | "linear" | string;
  t: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  dx2: number;
  dy2: number;
  counter: boolean;
  absolute: boolean;
}

export interface PathOptions {
  closed: boolean;
}

export type Interpolate = [ number, number ];

export class Path {
  static unserialize(data: any) {
    return new Path(data.vertecies, data);
  }

  static interpolate(t: number, start: PathVertex, end: PathVertex): Interpolate {
    switch (end.interpolate) {
    case "polar":
      return Path.polar(t, start, end);
    case "polynomial":
      return Path.polynomial(t, start, end);
    case "linear":
      return Path.linear(t, start, end);
    default:
      return [ end.x, end.y ];
    }
  }

  static linear(t: number, start: PathVertex, end: PathVertex): Interpolate {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    return [ start.x + (t * dx), start.y + (t * dy) ];
  }

  static polynomial(t: number, start: PathVertex, end: PathVertex): Interpolate {
    const h00 = (2 * t * t * t) - (3 * t * t) + 1;
    const h10 = (t * t * t) - (2 * t * t) + t;
    const h01 = (-2 * t * t * t) + (3 * t * t);
    const h11 = (t * t * t) - (t * t);

    const x = h00 * start.x + h10 * start.dx
              + h01 * end.x + h11 * end.dx2;
    const y = h00 * start.y + h10 * start.dy
              + h01 * end.y + h11 * end.dy2;

    return [ x, y ];
  }

  static polar(t: number, start: PathVertex, end: PathVertex): Interpolate {
    const cx = -end.dx2 + end.x;
    const cy = -end.dy2 + end.y;
    const sx = start.x - cx;
    const sy = start.y - cy;
    const ex = end.x - cx;
    const ey = end.y - cy;

    const a1 = Math.atan2(sy, sx);
    const a2 = _polarA2(a1, Math.atan2(ey, ex), end.counter);

    const r1 = Math.sqrt((sx * sx) + (sy * sy));
    const r2 = Math.sqrt((ex * ex) + (ey * ey));

    const a = a1 + (a2 - a1) * t;
    const r = r1 + (r2 - r1) * t;

    return [ r * Math.cos(a) + cx, r * Math.sin(a) + cy ];
  }

  private _vertceies: PathVertex[];
  private _closed: boolean;

  constructor(vertecies: PathVertex[] = [], options: Partial<PathOptions> = {}) {
    this._vertceies = vertecies;
    this._closed = options.closed != null ? options.closed : false;
  }

  serialize(): any {
    return {
      vertecies: this._vertceies,
      closed: this._closed,
      meta: { version: 1, type: "path" },
    };
  }

  addVertex(x: number, y: number): void {
    if (this._vertceies.length === 0) {
      this._vertceies.push({
        t: 1000,
        x: x,
        y: y,
        dx: 0,
        dy: 0,
        dx2: 0,
        dy2: 0,
        interpolate: "linear",
        counter: false,
        absolute: false,
      });
    } else {
      const calc = this.calc();
      const c = calc[calc.length - 1];

      this._vertceies.push({
        t: 1000,
        x: x - c.x,
        y: y - c.y,
        dx: 0,
        dy: 0,
        dx2: 0,
        dy2: 0,
        interpolate: "linear",
        counter: false,
        absolute: false,
      });
    }
  }

  removeVertex(i: number): void {
    this._vertceies.splice(i, 1);
  }

  vertex(i: number): PathVertex {
    return this._vertceies[i];
  }

  calc(): PathVertex[] {
    const rval = new Array();
    let prev: PathVertex | null  = null;

    this._vertceies.forEach((e) => {
      let v = Object.assign({}, e)

      if (prev != null && !v.absolute) {
        v.x += prev.x;
        v.y += prev.y;
      }

      rval.push(v);
      prev = v;
    });
    
    return rval;
  }

  recalcVertex(i: number, x: number, y: number): void {
    const v = this._vertceies[i];

    if (i === 0 || v.absolute) {
      v.x = x;
      v.y = y;
    } else {
      const calc = this.calc();
      const prev = calc[i - 1];

      v.x = x - prev.x;
      v.y = y - prev.y;
    }
  }

  size(): number {
    return this._vertceies.length;
  }

  empty(): boolean {
    return this._vertceies.length === 0;
  }

  closed(): boolean;
  closed(value: null): boolean;
  closed(value: boolean): void;

  closed(value?: boolean | null): boolean | void {
    if (value == null) {
      return this._closed;
    } else {
      this._closed = value;
    }
  }

  vertexIndexAt(x: number, y: number, r: number = 0): number {
    return this.calc().findIndex((e) => {
      const dx = e.x - x;
      const dy = e.y - y;

      return Math.sqrt((dx * dx) + (dy * dy)) < r;
    });
  }

  tangentIndexAt(x: number, y: number, r: number = 0): number {
    return this.calc().findIndex((e, i, c) => {
      if ((i < c.length - 1 && c[i + 1].interpolate === "polynomial") ||
          (this._closed && i === c.length - 1 && c[0].interpolate === "polynomial") ||
          ((this._closed || i > 0) && e.interpolate === "polar")) {
        const dx = (e.x + e.dx) - x;
        const dy = (e.y + e.dy) - y;

        return Math.sqrt((dx * dx) + (dy * dy)) < r;
      } else {
        return false;
      }
    });
  }

  tangent2IndexAt(x: number, y: number, r: number = 0): number {
    return this.calc().findIndex((e, i) => {
      if ((this._closed || i > 0) && e.interpolate !== "linear") {
        const dx = (e.x - e.dx2) - x;
        const dy = (e.y - e.dy2) - y;

        return Math.sqrt((dx * dx) + (dy * dy)) < r;
      } else {
        return false;
      }
    });
  }

  interpolate(t: number, repeat: boolean = true): Interpolate {
    let s = 0;
    const calc = this.calc();

    if (repeat) {
      let total = (this.closed() ? calc[0].t : 0);

      for (let i = 1; i < calc.length; ++i) {
        total += calc[i].t;
      }

      t = t % total;
    }

    for (let i = 1; i < calc.length; ++i) {
      const e = calc[i];

      if (t >= s && t < s + e.t) {
        const prev = calc[i - 1];
        return Path.interpolate((t - s) / e.t, prev, e);
      } else if (this.closed() && i === calc.length - 1 && t >= s + e.t) {
        const next = calc[0];
        return Path.interpolate((t - (e.t + s)) / next.t, e, next);
      }

      s += e.t;
    }

    if (this.closed()) {
      return [ calc[0].x, calc[0].y ];
    } else {
      return [ calc[calc.length - 1].x, calc[calc.length - 1].y ];
    }
  }

  reorigin(x: number, y: number): void {
    if (this._vertceies.length > 0) {
      this._vertceies[0].x = x;
      this._vertceies[0].y = y;
    }
  }
}

function _polarA2(a1: number, a2: number, counter: boolean): number {
  if (counter) {
    return a2 <= a1 ? a2 : a2 - 2 * Math.PI;
  } else {
    return a2 <= a1 ? a2 + 2 * Math.PI : a2;
  }
}
