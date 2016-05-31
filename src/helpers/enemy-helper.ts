import Engine from "../engine/engine";
import IO from "../engine/io";

import BlockoidEntity from "../entities/blockoid-entity";
import DroneEntity from "../entities/drone-entity";
import DronePath1 from "../paths/drone-path1";

export function Blockoid(engine: Engine, x: number): IO<Engine> {
  let blockoid = (new BlockoidEntity())
    .setIn([ "position", "x" ], x)
    .setIn([ "position", "y" ], -24);
  let newEngine = engine.mkEntity(blockoid);

  return IO.Put(newEngine)
    .bind((_e: Engine) => IO.Delay(9000))
    .bind((e: Engine) => {
      return IO.Put(e.rmEntity(newEngine.lastEntity()));
    });
}

export function Drone(engine: Engine, x: number): IO<Engine> {
  let drone = (new DroneEntity())
    .setIn([ "position", "x" ], x)
    .setIn([ "position", "y" ], -16);
  drone = drone.setIn([ "movement", "path" ], DronePath1(drone));
  let newEngine = engine.mkEntity(drone);

  return IO.Put(newEngine)
    .bind((_e: Engine) => IO.Delay(9000))
    .bind((e: Engine) => {
      return IO.Put(e.rmEntity(newEngine.lastEntity()));
    });
}
