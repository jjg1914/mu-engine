import Engine, { Entity } from "../engine/engine";
import Collision, { query } from "../engine/collision";

export default function CollisionSystem(engine: Engine): Engine {
  let tree = Collision(engine, 208, 256);

  return engine.runIterator([ "target" ], (value: Engine,
                                          entity: Entity): Engine => {
    const group = entity.getIn([ "target", "group" ]);

    let collisions = query(tree, entity);
    let tmp = collisions.filter((e: Entity) => {
      return e.has("damage");
    }).reduce((m: Engine, e: Entity): Engine => {
      if (group !== e.getIn([ "damage", "group" ])) {
        let v = entity.getIn([ "target", "value" ]);
        let damage = e.getIn([ "damage", "value" ]);

        entity = entity.setIn([ "target", "value" ], v - damage);

        return m.upEntity(entity).rmEntity(e);
      } else {
        return m;
      }
    }, value);

    if (entity.getIn([ "target", "group" ]) === "A") {
      let count = collisions.filter((e) => {
        return e.has("target") && e.getIn([ "target", "group" ]) !== "A";
      }).size;

      if (count > 0) {
        entity = entity.setIn([ "target", "value" ], 0);
        tmp = tmp.upEntity(entity);
      }
    }

    return tmp;
  });
}
