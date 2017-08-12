import { Entity } from "../entities/entity";
import { InputEventData } from "../events/input-event";
import { Keys } from "../modules/input-module";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface Control2WayEntity extends Entity {
  control: {
    xAccel: number;
    jumpSpeed: number;
  };
  position: PositionData;
  movement: MovementData;
}

export function Control2WaySystem(entity: Control2WayEntity): void {
  entity.on("keydown", (event: InputEventData) => {
    switch (event.which) {
    case Keys.ARROW_LEFT:
    case Keys.ARROW_RIGHT:
      entity.movement.xAccel += _accel(event.which, entity.control.xAccel);
      break;
    case Keys.ARROW_UP:
      if (entity.position.landing != null) {
        entity.movement.ySpeed = -entity.control.jumpSpeed;
        entity.position.landing = null;
      }
      break;
    }
  });

  entity.on("keyup", (event: InputEventData) => {
    switch (event.which) {
    case Keys.ARROW_LEFT:
    case Keys.ARROW_RIGHT:
      entity.movement.xAccel -= _accel(event.which, entity.control.xAccel);
      break;
    }
  });
}

function _accel(which: number, accel: number): number {
  switch (which) {
  case Keys.ARROW_LEFT:
    return -accel; 
  case Keys.ARROW_RIGHT:
    return accel; 
  default:
    return 0;
  }
}
