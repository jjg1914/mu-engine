import Engine from "../engine/engine";
import IO from "../engine/io";
import Timeline from "../engine/timeline";

import { Blockoid, Drone } from "../helpers/enemy-helper";

export default function Stage1(): IO<Engine> {
  return Timeline<Engine>([
    [ 1000, () => {
      return Timeline<Engine>([
        [ 0, (x) => Drone(x, 16) ],
        [ 500, (x) => Drone(x, 48) ],
        [ 250, (x) => Drone(x, 0) ],
      ]);
    } ],
    [ 1000, (e) => Blockoid(e, 92) ],
    [ 500, (e) => Blockoid(e, 40) ],
    [ 500, (e) => Blockoid(e, 168) ],
  ]);
}
