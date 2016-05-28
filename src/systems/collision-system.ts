import Engine, { Entity } from "../engine/engine";
import Collision, { query } from "../engine/collision";

export default function CollisionSystem(engine: Engine,
                                        entity: Entity): Engine {
  let collisions = query(Collision(engine, 208, 256), entity);

  if (collisions.size > 0) {
    entity = entity.setIn([ "render", "stroke" ], "#f33c6d");
  } else {
    entity = entity.setIn([ "render", "stroke" ], "#00b6E4");
  }

  return engine.upEntity(entity);
}
