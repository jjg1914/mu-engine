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
      .setIn([ "position", "x" ], entity.getIn([ "position", "x"]) + 16)
      .setIn([ "position", "y" ], entity.getIn([ "position", "y"]) + 32);
    let newEngine = engine.mkEntity(bullet);

    return IO.Put(newEngine).bind(() => {
      return IO.Delay(3000);
    }).bind((engine2) => {
      let id = newEngine.get("id").toString();

      return IO.Put(engine2.rmEntity(engine2.getIn([ "entities", id ])));
    });
  } else {
    return engine;
  }
}
