import Engine from "../engine/engine";
import IO from "../engine/io";
import Timeline from "../engine/timeline";

import { Blockoid } from "../helpers/enemy-helper";

export default function Stage1(): IO<Engine> {
  return Timeline<Engine>([
    [ 2000, (e: Engine): IO<Engine> => Blockoid(e, 92) ],
    [ 500, (e: Engine): IO<Engine> => Blockoid(e, 40) ],
    [ 500, (e: Engine): IO<Engine> => Blockoid(e, 168) ],
  ]);
}
