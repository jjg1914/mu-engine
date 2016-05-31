import Engine, { Entity } from "../engine/engine";
import { Keys, EventType, Event } from "../engine/input";
import IO from "../engine/io";

import BulletEntity from "../entities/bullet-entity";

export default function ShootSystem(engine: Engine,
                                    entity: Entity,
                                    event: Event): Engine | IO<Engine> {
  if (event.type === EventType.KEY_DOWN &&
      event.which === Keys.SPACE) {
    let bullet = (new BulletEntity())
      .setIn([ "position", "x" ], entity.getIn([ "position", "x"]) + 8.5)
      .setIn([ "position", "y" ], entity.getIn([ "position", "y"]) + 4);
    let newEngine = engine.mkEntity(bullet);

    return IO.Thread<Engine>([
      (_e: Engine) => IO.Put(newEngine),
      (_e: Engine) => IO.Delay(3000),
      (e: Engine) => IO.Put(e.rmEntity(newEngine.lastId())),
    ]);
  } else {
    return engine;
  }
}
