import Engine, { Entity } from "../engine/engine";
import Collision, { query } from "../engine/collision";

export default function CollisionSystem(engine: Engine): Engine {
  let tree = Collision(engine, 208, 256);

  return engine.runIterator([ "target" ], (value: Engine,
                                          entity: Entity): Engine => {
    return query(tree, entity).filter((e: Entity) => {
      return e.has("damage");
    }).reduce((m: Engine, e: Entity): Engine => {
      let v = entity.getIn([ "target", "value" ]);
      let damage = e.getIn([ "damage", "value" ]);

      entity = entity.setIn([ "target", "value" ], v - damage);

      return m.upEntity(entity).rmEntity(e);
    }, value);
  });
}
