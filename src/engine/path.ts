import { Entity } from "../engine/engine";

interface Node {
  t?: number;
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
  linear?: boolean;
  absolute?: boolean;
}

export type PathF = (t: number) => [ number, number ];

function search(path: Node[],
                t: number): [ Node, Node ] {
  let i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path[i].t <= t) {
      break;
    }
  }

  return [ path[i] , path[i + 1 ] ];
}

export default function Path(entity: Entity, path: Node[]): PathF {
  let norms = path.reduce((m: Node[], v: Node): Node[] => {
    let last = (m.length > 0) ? m[m.length - 1] : {
      t: 0,
      x: entity.getIn([ "position", "x" ]),
      y: entity.getIn([ "position", "y" ]),
    };

    let [ x, y ] = [ v.x || 0, v.y || 0 ];

    if (!v.absolute) {
      x += last.x;
      y += last.y;
    }

    return m.concat([ {
      t: last.t + v.t,
      x: x,
      y: y,
      dx: v.dx,
      dy: v.dy,
      linear: v.linear,
    }]);
  }, []);

  return (t: number): [ number, number ] => {
    let [ start, end ] = search(norms, t);

    if (end != undefined) {
      let nt = (t - start.t) / (end.t - start.t);

      if (end.linear) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;

        return [ (dx * nt) + start.x, (dy * nt) + start.y ];
      } else {
        let h00 = (2 * nt * nt * nt) - (3 * nt * nt) + 1;
        let h10 = (nt * nt * nt) - (2 * nt * nt) + nt;
        let h01 = (-2 * nt * nt * nt) + (3 * nt * nt);
        let h11 = (nt * nt * nt) - (nt * nt);

        let x = h00 * start.x + h10 * start.dx
              + h01 * end.x + h11 * end.dx;
        let y = h00 * start.y + h10 * start.dy
              + h01 * end.y + h11 * end.dy;

        return [ x, y ];
      }
    } else {
      return [ start.x, start.y ];
    }
  };
}
