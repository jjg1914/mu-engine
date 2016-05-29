import "../poly.d.ts";
import { Record, List } from "immutable";

export type vec2 = [ number, number ];

export default class Polygon extends Record({
  verticies: List<vec2>(),
}) {
  public verticies: List<vec2>;

  public constructor(verticies: vec2[] | List<vec2>) {
    if (verticies instanceof Array) {
      super({ verticies: List<vec2>(verticies) });
    } else {
      super({ verticies: verticies });
    }
  }

  public translate(x: number, y: number): Polygon {
    return new Polygon(this.verticies.map((e: vec2): vec2 => {
      return <vec2> [ e[0] + x, e[1] + y ];
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
