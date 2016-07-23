import Engine, { Entity } from "../engine/engine";
import IO from "../engine/io";

export default function FlashSystem(engine: Engine,
                                    oldEngine: Engine): IO<Engine> {
  return engine.runIOIterator([ "target" ],
                              (entity: Entity): IO<Engine> => {
    let oldEntity = oldEngine.rdEntity(entity);

    if (oldEntity) {
      let newValue = entity.getIn([ "target", "value" ]);
      let oldValue = oldEntity.getIn([ "target", "value" ]);

      if (newValue < oldValue) {
        let stroke = entity.getIn([ "render", "stroke" ]);
        let i = engine.patchEntity(entity, { render: { stroke: "#f1f5f6" } });

        return IO.Thread<Engine>([
          (_e: Engine) => IO.Put<Engine>(i),
          (_e: Engine) => IO.Delay<Engine>(50),
          (e: Engine) => {
            return IO.Put(e.patchEntity(entity, {
              render: { stroke: stroke },
            }));
          },
        ]);
      }
    }

    return IO.Get<Engine>();
  });
}
