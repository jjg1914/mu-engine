import Engine, { Entity } from "../engine/engine";
import { Event as RenderEvent } from "../engine/render";
import { Event as InputEvent } from "../engine/input";
import { Event as IntervalEvent } from "../engine/interval";
import IO from "../engine/io";

import PlayerEntity from "../entities/player-entity";

import BackgroundSystem from "../systems/background-system";
import RenderSystem from "../systems/render-system";
import InputSystem from "../systems/input-system";
import ShootSystem from "../systems/shoot-system";
import MovementSystem from "../systems/movement-system";
import AnimateSystem from "../systems/animate-system";
import CollisionSystem from "../systems/collision-system";
import TargetSystem from "../systems/target-system";
import FlashSystem from "../systems/flash-system";
import PathSystem from "../systems/path-system";

import Stage1 from "../stages/stage-1.ts";

export default function StageState(value: Engine): IO<Engine> {
  let entity: Entity = (new PlayerEntity())
    .setIn([ "position", "x" ], 94)
    .setIn([ "position", "y" ], 208);

  let newValue = value.mkEntity(entity);

  let tmp2 = newValue.pushState((engine: Engine,
                                event: Object): Engine | IO<Engine> => {
    if (event instanceof RenderEvent) {
      BackgroundSystem(event);
      RenderSystem(engine, event);
    } else if (event instanceof InputEvent) {
      if (engine.rdEntity(tmp2.lastId())) {
        let tmp = InputSystem(engine, engine.rdEntity(tmp2.lastId()), event);
        tmp = ShootSystem(tmp, tmp.rdEntity(tmp2.lastId()), event);
        return tmp;
      }
    } else if (event instanceof IntervalEvent) {
      let tmp = MovementSystem(engine, event);
      tmp = PathSystem(tmp, event);
      tmp = AnimateSystem(tmp, event);
      tmp = CollisionSystem(tmp);
      tmp = TargetSystem(tmp);
      return IO.Put(tmp).bind((e: Engine) => {
        return FlashSystem(e, engine);
      });
    }

    return engine;
  });

  return IO.Put(tmp2).bind((_e: Engine) => Stage1());
}
