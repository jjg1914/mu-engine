import Engine, { Entity } from "../engine/engine";
import { Keys, EventType, Event } from "../engine/input";

import BulletEntity from "../entities/bullet-entity";

export default function ShootSystem(engine: Engine,
                                    entity: Entity,
                                    event: Event): Engine {
  if (event.type === EventType.KEY_DOWN &&
      event.which === Keys.SPACE) {
    let bullet = (new BulletEntity())
      .setIn([ "position", "x" ], entity.getIn([ "position", "x"]) + 8.5)
      .setIn([ "position", "y" ], entity.getIn([ "position", "y"]) + 4);
    return engine.mkEntity(bullet);
  } else {
    return engine;
  }
}
