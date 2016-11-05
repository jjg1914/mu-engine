import Engine, { Entity } from "../engine";
import { Event as IntervalEvent } from "../modules/interval";

export default function PathSystem(engine: Engine,
                                   event: IntervalEvent ): Engine {
  return engine.runIterator([ "position", "movement", "path" ],
                            (memo: Engine, entity: Entity): Engine => {
    let path = entity.getIn([ "path", "path" ]);
    let pathT = entity.getIn([ "path", "pathT" ]);

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
