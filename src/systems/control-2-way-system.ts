import { Entity } from "../entities/entity";
import { InputEventData } from "../events/input-event";
import { ControlEvent } from "../events/control-event";
import { PositionData } from "../components/position-component";
import { AccelData } from "../components/accel-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";
import { ControlData } from "../components/control-component";

export interface Control2WayEntity extends Entity {
  position: PositionData;
  control: ControlData;
  accel: AccelData;
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
        entity.accel.xAccel = _accel(entity.control.xAccel, _left, _right);

        if (entity.accel.xAccel < 0) {
          entity.movement.xSpeed = Math.min(entity.movement.xSpeed, 0);
          entity.send("start-left", new ControlEvent("start-left"));
        } else {
          entity.movement.xSpeed = Math.max(entity.movement.xSpeed, 0);
          entity.send("stop-left", new ControlEvent("stop-left"));
        }

        break;
      case "ArrowRight":
      case "D":
        entity.accel.xAccel = _accel(entity.control.xAccel, _left, _right);

        if (entity.accel.xAccel > 0) {
          entity.movement.xSpeed = Math.max(entity.movement.xSpeed, 0);
          entity.send("start-right", new ControlEvent("start-right"));
        } else {
          entity.movement.xSpeed = Math.min(entity.movement.xSpeed, 0);
          entity.send("stop-right", new ControlEvent("stop-right"));
        }

        break;
      case "ArrowDown":
      case "S":
        if (entity.collision.landing !== undefined) {
          const solid = entity.collision.landing.collision.solid;

          if (solid instanceof Array) {
            const ySolid = solid[1];

            if (!isNaN(ySolid) && ySolid > 0) {
              entity.collision.landing = undefined;
              entity.position.y += 1;
            }
          }
        }

        break;
      case " ":
        if (entity.collision.landing !== undefined) {
          entity.movement.ySpeed = -entity.control.jumpSpeed;
          entity.collision.landing = undefined;
          entity.accel.nogravity = true;
          setTimeout(() => {
            entity.accel.nogravity = false;
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
        entity.accel.xAccel = _accel(entity.control.xAccel, _left, _right);

        if (entity.accel.xAccel > 0) {
          entity.send("start-right", new ControlEvent("start-right"));
        } else {
          entity.send("stop-left", new ControlEvent("stop-left"));
        }

        break;
      case "ArrowRight":
      case "D":
        entity.accel.xAccel = _accel(entity.control.xAccel, _left, _right);

        if (entity.accel.xAccel < 0) {
          entity.send("start-left", new ControlEvent("start-left"));
        } else {
          entity.send("stop-right", new ControlEvent("stop-right"));
        }

        break;
      case " ":
        if (entity.collision.landing === undefined &&
            entity.movement.ySpeed < 0) {
          entity.movement.ySpeed = 0;
          entity.accel.nogravity = false;
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
