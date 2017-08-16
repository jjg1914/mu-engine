import { Entity } from "../entities/entity";
import { InputEventData } from "../events/input-event";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface Control2WayEntity extends Entity {
  control: {
    xAccel: number;
    jumpSpeed: number;
    jumpCutoff: number;
  };
  position: PositionData;
  movement: MovementData;
}

export function Control2WaySystem(entity: Control2WayEntity): void {
  entity.on("keydown", (event: InputEventData) => {
    const _left = event.inputs["ArrowLeft"] || event.inputs["A"];
    const _right = event.inputs["ArrowRight"] || event.inputs["D"];

    switch (event.which) {
    case "ArrowLeft":
    case "A":
    case "ArrowRight":
    case "D":
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);
      break;
    case " ":
      if (entity.position.landing != null) {
        entity.movement.ySpeed = -entity.control.jumpSpeed;
        entity.position.landing = null;
        entity.movement.nogravity = true;
        setTimeout(() => {
          entity.movement.nogravity = false;
        }, entity.control.jumpCutoff);
      }
      break;
    }
  });

  entity.on("keyup", (event: InputEventData) => {
    const _left = event.inputs["ArrowLeft"] || event.inputs["A"];
    const _right = event.inputs["ArrowRight"] || event.inputs["D"];

    switch (event.which) {
    case "ArrowLeft":
    case "A":
    case "ArrowRight":
    case "D":
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);
      break;
    case " ":
      if (entity.position.landing == null && entity.movement.ySpeed < 0) {
        entity.movement.ySpeed = 0;
        entity.movement.nogravity = false;
      }
      break;
    }
  });
}

function _accel(accel: number,
                left?: boolean | null,
                right?: boolean | null)
: number {
  let rval = 0;

  if (left) {
    rval -= accel;
  }

  if (right) {
    rval += accel;
  }

  return rval;
}
