import Engine from "../engine/engine";
import IO from "../engine/io";

import { Blockoid } from "../helpers/enemy-helper";

export default function Stage1(): IO<Engine> {
  return IO.All<Engine>([
    IO.Delay(2000).bind((e: Engine): IO<Engine> => {
      return Blockoid(e, 92);
    }),
    IO.Delay(2500).bind((e: Engine): IO<Engine> => {
      return Blockoid(e, 40);
    }),
    IO.Delay(3000).bind((e: Engine): IO<Engine> => {
      return Blockoid(e, 168);
    }),
  ]);
}
