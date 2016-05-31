import Engine from "../engine/engine";
import IO from "../engine/io";
import Timeline from "../engine/timeline";

import { Blockoid, Drone } from "../helpers/enemy-helper";

export default function Stage1(): IO<Engine> {
  return Timeline<Engine>([
    [ 1000, (e: Engine): IO<Engine> => Drone(e, 0) ],
    // [ 1000, (e: Engine): IO<Engine> => Blockoid(e, 92) ],
    // [ 500, (e: Engine): IO<Engine> => Blockoid(e, 40) ],
    // [ 500, (e: Engine): IO<Engine> => Blockoid(e, 168) ],
  ]);
}
