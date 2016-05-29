import Engine from "../engine/engine";
import IO from "../engine/io";

import BlockoidEntity from "../entities/blockoid-entity";
import Lifetime from "../helpers/lifetime";

export default function Stage1(): IO<Engine> {
  return IO.All<Engine>([
    IO.Delay(2000).bind((t: Engine): IO<Engine> => {
      let blockoid = (new BlockoidEntity())
        .setIn([ "position", "x" ], 92);
      let e = t.mkEntity(blockoid);

      return IO.Put(e).bind((_e: Engine): IO<Engine> => {
        return Lifetime(9000, e.get("id"));
      });
    }),
    IO.Delay(2500).bind((t: Engine): IO<Engine> => {
      let blockoid = (new BlockoidEntity)
        .setIn([ "position", "x" ], 40);
      let e = t.mkEntity(blockoid);

      return IO.Put(e).bind((_e: Engine): IO<Engine> => {
        return Lifetime(9000, e.get("id"));
      });
    }),
    IO.Delay(3000).bind((t: Engine): IO<Engine> => {
      let blockoid = (new BlockoidEntity)
        .setIn([ "position", "x" ], 168);
      let e = t.mkEntity(blockoid);

      return IO.Put(e).bind((_e: Engine): IO<Engine> => {
        return Lifetime(9000, e.get("id"));
      });
    }),
  ]);
}
