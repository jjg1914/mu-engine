import { Entity } from "../engine/engine";

interface Node {
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
}

type Pair = [ number, Node ];
export type PathF = (t: number) => [ number, number ];

function search(path: Pair[],
                t: number): [ Pair, Pair ] {
  let i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path[i][0] <= t) {
      break;
    }
  }

  return [ path[i] , path[i + 1 ] ];
}

export default function Path(entity: Entity, path: Pair[]): PathF {
  let norms = path.reduce((m: Pair[], v: Pair): Pair[] => {
    let last = (m.length > 0) ? m[m.length - 1] : <Pair> [ 0, {
      x: entity.getIn([ "position", "x" ]),
      y: entity.getIn([ "position", "y" ]),
      dx: 0,
      dy: 0,
    } ];

    return m.concat([ [ last[0] + v[0], {
      x: (v[1].x || 0) + last[1].x,
      y: (v[1].y || 0) + last[1].y,
      dx: v[1].dx || last[1].dx,
      dy: v[1].dy || last[1].dy,
    } ] ]);
  }, []);

  return (t: number): [ number, number ] => {
    let [ start, end ] = search(norms, t);

    if (end != undefined) {
      let nt = (t - start[0]) / (end[0] - start[0]);

      let h00 = (2 * nt * nt * nt) - (3 * nt * nt) + 1;
      let h10 = (nt * nt * nt) - (2 * nt * nt) + nt;
      let h01 = (-2 * nt * nt * nt) + (3 * nt * nt);
      let h11 = (nt * nt * nt) - (nt * nt);

      let x = h00 * start[1].x + h10 * start[1].dx
            + h01 * end[1].x + h11 * end[1].dx;
      let y = h00 * start[1].y + h10 * start[1].dy
            + h01 * end[1].y + h11 * end[1].dy;

      return [ x, y ];
    } else {
      return [ start[1].x, start[1].y ];
    }
  };
}
