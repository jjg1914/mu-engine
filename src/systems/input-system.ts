import Engine, { Entity } from "../engine/engine";
import { Keys, EventType, Event } from "../engine/input";

export default function InputSystem(engine: Engine,
                                    entity: Entity,
                                    event: Event): Engine {
  let coeff = 0;

  switch (event.type) {
    case EventType.KEY_UP:
      coeff = -1;
      break;
    case EventType.KEY_DOWN:
      coeff = 1;
      break;
    default:
      break;
  }

  let xSpeed = entity.getIn([ "movement", "xSpeed" ]);
  let ySpeed = entity.getIn([ "movement", "ySpeed" ]);

  switch (event.which) {
    case Keys.ARROW_LEFT:
      xSpeed += -64 * coeff;
      break;
    case Keys.ARROW_RIGHT:
      xSpeed += 64 * coeff;
      break;
    case Keys.ARROW_UP:
      ySpeed += -64 * coeff;
      break;
    case Keys.ARROW_DOWN:
      ySpeed += 64 * coeff;
      break;
    default:
      break;
  }

  return engine.upEntity(entity.setIn([ "movement", "xSpeed" ], xSpeed)
                               .setIn([ "movement", "ySpeed" ], ySpeed));
}
