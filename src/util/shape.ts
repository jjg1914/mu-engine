export type Vertex = [ number, number ];
export type Normal = [ number, number ];
export type Interval = [ number, number ];

export interface Dimensions {
  width: number;
  height: number;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Shape {
  clone(): Shape;
  translate(x: number, y: number): this;
  rotate(r: number): this;
  normals(other: {}): Normal[];
  project(axis: Normal): Interval;
  dimensions(): Dimensions;
  bounds(): Bounds;
  minimum(left: number, right: number): number;
  path(): Path2D;
}

export class Polygon implements Shape {
  verticies: Vertex[];

  constructor(verticies: Vertex[]) {
    this.verticies = verticies;
  }

  static fromBounds(bounds: Bounds): Polygon {
    return new Polygon([
      [ bounds.left, bounds.top ],
      [ bounds.right, bounds.top ],
      [ bounds.right, bounds.bottom ],
      [ bounds.left, bounds.bottom ],
    ]);
  }

  clone(): Polygon {
    const verticies = new Array(this.verticies.length);

    for (let i = 0; i < verticies.length; i += 1) {
      verticies[i] = [ this.verticies[i][0], this.verticies[i][1] ];
    }

    return new Polygon(verticies);
  }

  translate(x: number, y: number): this {
    for (let v of this.verticies) {
      v[0] += x;
      v[1] += y;
    }

    return this;
  }

  rotate(r: number): this {
    if (isNaN(r) || r === 0) {
      return this;
    }

    const dim = this.dimensions();
    const x = dim.width / 2;
    const y = dim.height / 2;
    const c = Math.cos(r);
    const s = Math.sin(r);

    const const1 = -c * x + s * y + x;
    const const2 = -s * x - c * y + y;

    for (let v of this.verticies) {
      v[0] = c * v[0] - s * v[1] + const1;
      v[1] = s * v[0] + c * v[1] + const2;
    }

    return this;
  }

  normals(): Normal[] {
    const normals = new Array(this.verticies.length);
    let prev = this.verticies[this.verticies.length - 1];

    for (let i = 0; i < this.verticies.length; i += 1) {
      const v = this.verticies[i];

      normals[i] = [ v[1] - prev[1], prev[0] - v[0] ];
      prev = v;
    }

    return normals;
  }

  project(axis: Normal): Interval {
    const memo = [ Infinity, -Infinity ] as Interval;

    for (let v of this.verticies) {
      const dot = axis[0] * v[0] + axis[1] * v[1];

      memo[0] = Math.min(dot, memo[0]);
      memo[1] = Math.max(dot, memo[1]);
    }

    return memo;
  }

  dimensions(): Dimensions {
    const bounds = this.bounds();

    return {
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top,
    };
  }

  bounds(): Bounds {
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    for (let v of this.verticies) {
      left = Math.min(v[0], left);
      right = Math.max(v[0], right);
      top = Math.min(v[1], top);
      bottom = Math.max(v[1], bottom);
    }

    return {
      left: left,
      right: right,
      top: top,
      bottom: bottom,
    };
  }

  minimum(left: number, right: number): number {
    let min = Infinity;

    for (let i = 0; i < this.verticies.length; ++i) {
      const j = (i === this.verticies.length - 1) ? 0 : i + 1;
      const a = this.verticies[i];
      const b = this.verticies[j];

      if (a[0] <= right && b[0] >= left) {
        if (a[0] === b[0] || a[1] === b[1]) {
          min = Math.min(a[1], b[1], min);
        } else {
          const slope = (b[1] - a[1]) / (b[0] - a[0]);
          const int = a[1] - (slope * a[0]);
          const cap = Math.min(a[1], b[1]);

          min = Math.min(Math.max((slope * left) + int, cap),
                         Math.max((slope * right) + int, cap), min);
        }
      }
    }

    return min;
  }

  path(): Path2D {
    const path = new Path2D();

    if (this.verticies.length > 0) {
      let last = this.verticies[this.verticies.length - 1];

      path.moveTo(last[0], last[1]);
      for (let v of this.verticies) {
        path.lineTo(v[0], v[1]);
      }
    }

    return path;
  }
}

export class Circle implements Shape {
  private _radius: number;
  private _x: number;
  private _y: number;

  constructor(radius: number, x: number, y: number) {
    this._radius = radius;
    this._x = x;
    this._y = y;
  }

  radius(): number {
    return this._radius;
  }

  clone(): Circle {
    return new Circle(this._radius, this._x, this._y);
  }

  translate(x: number, y: number): this {
    this._x += x;
    this._y += y;

    return this;
  }

  rotate(_r: number): this {
    return this;
  }

  normals(other: {}): Normal[] {
    if (other instanceof Circle) {
      const x = other._x - this._x;
      const y = other._y - this._y;

      return [ [ x, y ] ];
    } else if (other instanceof Polygon) {
      let normal;
      let magnitude = Infinity;

      for (let v of other.verticies) {
        let x = v[0] - this._x;
        let y = v[0] - this._y;
        let d = Math.sqrt(x * x + y * y);

        if (d < magnitude) {
          normal = [ x, y ] as [ number, number ];
          magnitude = d;
        }
      }

      return (normal === undefined ? [] : [ normal ]);
    } else {
      throw new Error("unsupported shape");
    }
  }

  project(axis: Normal): Interval {
    const dot = axis[0] * this._x + axis[1] * this._y;

    return [ dot - this._radius, dot + this._radius ];
  }

  dimensions(): Dimensions {
    return {
      width: this._radius * 2,
      height: this._radius * 2,
    };
  }

  bounds(): Bounds {
    return {
      left: this._x - this._radius,
      right: this._x + this._radius - 1,
      top: this._y - this._radius,
      bottom: this._y + this._radius - 1,
    };
  }

  minimum(_left: number, _right: number): number {
    throw new Error("not implemented");
  }

  path(): Path2D {
    const path = new Path2D();

    path.ellipse(this._x, this._y,
                 this._radius, this._radius,
                 0, 0, 2 * Math.PI);

    return path;
  }
}
