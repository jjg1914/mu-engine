import Engine, { Entity } from "../engine";
import { Event as IntervalEvent } from "../modules/interval";
import { maskFor } from "../util/shape";

export default function MovementSystem(engine: Engine,
                                       event: IntervalEvent ): Engine {
  return engine.runIterator([ "position", "movement" ],
                            (memo: Engine, entity: Entity): Engine => {
    let xD = entity.getIn([ "movement", "xSpeed" ]) * ( event.dt / 1000 );
    let yD = entity.getIn([ "movement", "ySpeed" ]) * ( event.dt / 1000 );

    let x = entity.getIn([ "position", "x" ]) + xD;
    let y = entity.getIn([ "position", "y" ]) + yD;

    entity = entity.setIn([ "position", "x" ], x)
                   .setIn([ "position", "y" ], y);

    if (entity.getIn([ "movement", "restrict" ])) {
      if (entity.getIn([ "movement", "restrict" ]) === "remove") {
        let bounds = maskFor(entity).bounds();

        if (!(bounds.left <= 208 && bounds.right >= 0
            && bounds.top <= 256 && bounds.bottom >= 0)) {
          return memo.rmEntity(entity);
        }
      } else {
        let dims = maskFor(entity).dimensions();

        x = Math.min(Math.max(x, 0), 208 - dims.width);
        y = Math.min(Math.max(y, 0), 256 - dims.height);
      }
    }

    return memo.upEntity(entity);
  });
}
