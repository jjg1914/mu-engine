import Engine, { Entity } from "../engine/engine";

export default function TargetSystem(engine: Engine): Engine {
  return engine.runIterator([ "target" ], (value: Engine,
                                          entity: Entity): Engine => {
    if (entity.getIn([ "target", "value" ]) <= 0) {
      return value.rmEntity(entity);
    } else {
      return value;
    }
  });
}
