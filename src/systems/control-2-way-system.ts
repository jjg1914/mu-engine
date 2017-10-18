import { Entity } from "../entities/entity";
import { InputEventData } from "../events/input-event";
import { ControlEvent } from "../events/control-event";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";

export interface Control2WayEntity extends Entity {
  control: {
    xAccel: number;
    jumpSpeed: number;
    jumpCutoff: number;
  };
  movement: MovementData;
  collision: CollisionData;
}

export function Control2WaySystem(entity: Control2WayEntity): void {
  entity.on("keydown", (event: InputEventData) => {
    const _left = event.inputs["ArrowLeft"] || event.inputs["A"];
    const _right = event.inputs["ArrowRight"] || event.inputs["D"];

    switch (event.which) {
    case "ArrowLeft":
    case "A":
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);

      if (entity.movement.xAccel < 0) {
        entity.send("start-left", new ControlEvent("start-left"));
      } else {
        entity.send("stop-left", new ControlEvent("stop-left"));
      }

      break;
    case "ArrowRight":
    case "D":
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);

      if (entity.movement.xAccel > 0) {
        entity.send("start-right", new ControlEvent("start-right"));
      } else {
        entity.send("stop-right", new ControlEvent("stop-right"));
      }

      break;
    case " ":
      if (entity.collision.landing != null) {
        entity.movement.ySpeed = -entity.control.jumpSpeed;
        entity.collision.landing = undefined;
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
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);

      if (entity.movement.xAccel > 0) {
        entity.send("start-right", new ControlEvent("start-right"));
      } else {
        entity.send("stop-left", new ControlEvent("stop-left"));
      }

      break;
    case "ArrowRight":
    case "D":
      entity.movement.xAccel = _accel(entity.control.xAccel, _left, _right);

      if (entity.movement.xAccel < 0) {
        entity.send("start-left", new ControlEvent("start-left"));
      } else {
        entity.send("stop-right", new ControlEvent("stop-right"));
      }

      break;
    case " ":
      if (entity.collision.landing == null && entity.movement.ySpeed < 0) {
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
