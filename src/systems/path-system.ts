import Engine, { Entity } from "../engine/engine";
import { Event } from "../engine/interval";

export default function PathSystem(engine: Engine,
                                   event: Event ): Engine {
  return engine.runIterator([ "position", "movement" ],
                            (memo: Engine, entity: Entity): Engine => {
    let path = entity.getIn([ "movement", "path" ]);
    let pathT = entity.getIn([ "movement", "pathT" ]);

    if (typeof path === "function") {
      let [ x, y ] = path(pathT);

      return memo.patchEntity(entity, {
        position: { x: x, y: y },
        movement: { pathT: pathT + event.dt },
      });
    } else {
      return memo;
    }
  });
}
