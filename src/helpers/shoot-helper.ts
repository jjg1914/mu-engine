import Engine, { Entity } from "../engine/engine";
import IO from "../engine/io";

export function Shoot(entity: Entity): IO<Engine> {
  let impl = function(engine: Engine): IO<Engine> {
    let e = engine.rdEntity(entity);

    if (e) {
      let bullet = entity.getIn([ "shoot", "bullet" ]);
      let frequency = entity.getIn([ "shoot", "frequency" ]);
      let bulletEntity = bullet(engine, e);

      if (bulletEntity != undefined) {
        return IO.Put<Engine>(engine.mkEntity(bulletEntity))
          .bind(() => IO.Delay<Engine>(frequency).bind(impl));
      } else {
        return IO.Delay<Engine>(frequency).bind(impl);
      }
    } else {
      return IO.Noop<Engine>();
    }
  };

  if (typeof entity.getIn([ "shoot", "bullet" ]) === "function") {
    let delay = entity.getIn([ "shoot", "delay" ]);

    if (delay > 0) {
      return IO.Delay<Engine>(delay).bind(impl);
    } else {
      return IO.Get<Engine>().bind(impl);
    }
  } else {
    return IO.Noop<Engine>();
  }
}
