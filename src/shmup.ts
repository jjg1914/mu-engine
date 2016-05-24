import Engine, { Entity } from "./engine/engine";
import { Event as RenderEvent } from "./engine/render";
import { Event as InputEvent } from "./engine/input";
import { Event as IntervalEvent } from "./engine/interval";
import IO from "./engine/io";

import TestEntity from "./entities/test-entity";

import BackgroundSystem from "./systems/background-system";
import RenderSystem from "./systems/render-system";
import InputSystem from "./systems/input-system";
import ShootSystem from "./systems/shoot-system";
import MovementSystem from "./systems/movement-system";

export default function Shmup(): Engine {
  let entity: Entity = (new TestEntity())
    .setIn([ "position", "x" ], 32)
    .setIn([ "position", "y" ], 32)
    .setIn([ "position", "width" ], 32)
    .setIn([ "position", "height" ], 32);

  let shmup = (new Engine).mkEntity(entity);
  let id = shmup.get("id").toString();

  return shmup.pushState((engine: Engine,
                          event: Object): Engine | IO<Engine> => {
      if (event instanceof RenderEvent) {
        BackgroundSystem(event);
        RenderSystem(engine, event);
      } else if (event instanceof InputEvent) {
        let tmp = InputSystem(engine, engine.getIn([ "entities", id ]), event);
        return ShootSystem(tmp, tmp.getIn([ "entities", id ]), event);
      } else if (event instanceof IntervalEvent) {
        return MovementSystem(engine, event);
      }

      return engine;
    });
}
