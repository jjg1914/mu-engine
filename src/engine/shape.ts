import "../poly.d.ts";
import { Record, List } from "immutable";

export type vec2 = [ number, number ];

export interface Shape {
  translate(x: number, y: number): Shape;
  rotate(r: number): Shape;
  project(axis: vec2): vec2;
  dimensions(): Dimensions;
  bounds(): Bounds;
  path(): Path2D;
}

export class Circle extends Record({
  radius: 0,
  x: 0,
  y: 0,
}) implements Shape {
  public radius: number;
  public x: number;
  public y: number;

  public constructor(radius: number) {
    super({ radius: radius, x: radius, y: radius });
  }

  public translate(x: number, y: number): Shape {
    return <Circle> this.set("x", this.x + x).set("y", this.y + y);
  }

  public rotate(_r: number): Shape {
    return this;
  }

  public normals(other: Shape): List<vec2> {
    if (other instanceof Circle) {
      let x = other.x - this.x;
      let y = other.y - this.y;

      return List<vec2>([ <vec2> [ x, y ] ]);
    } else if (other instanceof Polygon) {
      let vertex = other.verticies.map((e: vec2): [ vec2, number ] => {
        let x = e[0] - this.x;
        let y = e[1] - this.y;

        return [ [ x, y ], Math.sqrt(x * x + y * y) ];
      }).reduce((m: [ vec2, number ],
                 v: [ vec2, number ]): [ vec2, number ] => {
        return (v[1] < m[1]) ? v : m;
      });

      return List<vec2>([ <vec2> vertex[0] ]);
    } else {
      throw new Error("unsupported shape");
    }
  }

  public project(axis: vec2): vec2 {
    let dot = axis[0] * this.x + axis[1] * this.y;

    return <vec2> [ dot - this.radius, dot + this.radius ];
  }

  public dimensions(): Dimensions {
    return {
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }

  public bounds(): Bounds {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius,
    };
  }

  public path(): Path2D {
    let path = new Path2D();

    path.moveTo(this.x + this.radius, this.y);
    path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    return path;
  }
}

export class Polygon extends Record({
  verticies: List<vec2>(),
}) implements Shape {
  public verticies: List<vec2>;

  public constructor(verticies: vec2[] | List<vec2>) {
    if (verticies instanceof Array) {
      super({ verticies: List<vec2>(verticies) });
    } else {
      super({ verticies: verticies });
    }
  }

  public translate(x: number, y: number): Shape {
    return new Polygon(this.verticies.map((e: vec2): vec2 => {
      return <vec2> [ e[0] + x, e[1] + y ];
    }).toList());
  }

  public rotate(r: number): Shape {
    let dim = this.dimensions();
    let x = dim.width / 2;
    let y = dim.height / 2;
    let c = Math.cos(r);
    let s = Math.sin(r);

    let const1 = -c * x + s * y + x;
    let const2 = -s * x - c * y + y;

    return new Polygon(this.verticies.map((e: vec2): vec2 => {
      return <vec2> [
        c * e[0] - s * e[1] + const1,
        s * e[0] + c * e[1] + const2,
      ];
    }).toList());
  }

  public normals(): List<vec2> {
    let prev = this.verticies.last();

    return this.verticies.map((e: vec2): vec2 => {
      let normal = <vec2> [ e[1] - prev[1], prev[0] - e[0] ];
      prev = e;
      return normal;
    }).toList();
  }

  public project(axis: vec2): vec2 {
    return this.verticies.reduce((m: vec2, v: vec2): vec2 => {
      let dot = axis[0] * v[0] + axis[1] * v[1];
      return <vec2> [ Math.min(dot, m[0]), Math.max(dot, m[1]) ];
    }, <vec2> [ Infinity, -Infinity ]);
  }

  public dimensions(): Dimensions {
    let bounds = this.bounds();

    return {
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top,
    };
  }

  public bounds(): Bounds {
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    this.verticies.forEach((e: vec2) => {
      left = Math.min(e[0], left);
      right = Math.max(e[0], right);
      top = Math.min(e[1], top);
      bottom = Math.max(e[1], bottom);
    });

    return {
      left: left,
      right: right,
      top: top,
      bottom: bottom,
    };
  }

  public path(): Path2D {
    let path = new Path2D();
    let last = this.verticies.last();

    path.moveTo(last[0], last[1]);
    this.verticies.forEach((e: vec2) => {
      path.lineTo(e[0], e[1]);
    });

    return path;
  }
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Bounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
