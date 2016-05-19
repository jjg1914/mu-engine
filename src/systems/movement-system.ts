import Engine, { Entity } from "../engine/engine";
import { Event } from "../engine/interval";

export default function MovementSystem(engine: Engine,
                                       event: Event ): Engine {
  return engine.runIterator([ "position", "movement" ],
                            (memo: Engine, entity: Entity): Engine => {
    let xD = entity.getIn([ "movement", "xSpeed" ]) * ( event.dt / 1000 );
    let yD = entity.getIn([ "movement", "ySpeed" ]) * ( event.dt / 1000 );

    let x = entity.getIn([ "position", "x" ]) + xD;
    let y = entity.getIn([ "position", "y" ]) + yD;

    return memo.upEntity(entity.setIn([ "position", "x" ], x)
                               .setIn([ "position", "y" ], y));
  });
}
