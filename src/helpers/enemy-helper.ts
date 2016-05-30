import Engine, { Entity } from "../engine/engine";
import IO from "../engine/io";

import BlockoidEntity from "../entities/blockoid-entity";

export function Blockoid(engine: Engine, x: number): IO<Engine> {
  let blockoid = (new BlockoidEntity())
    .setIn([ "position", "x" ], x)
    .setIn([ "position", "y" ], -24);
  let newEngine = engine.mkEntity(blockoid);

  return IO.Put(newEngine)
    .bind((_e: Engine) => IO.Delay(9000))
    .bind((e: Engine) => {
      return IO.Put(e.rmEntity(newEngine.get("id")));
    });
}
