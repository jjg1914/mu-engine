import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { ControlData } from "../components/control-component";
import { AccelData } from "../components/accel-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";
import { InputEventData, InputStateIndex } from "../events/input-event";
import { ControlEvent } from "../events/control-event";

export interface Control4WaySystemEntity extends Entity {
  position: PositionData;
  control: ControlData;
  accel: AccelData;
  movement: MovementData;
  collision: CollisionData;
}

export function Control4WaySystem(entity: Control4WaySystemEntity): void {
  entity.on("keydown", (ev: InputEventData) => {
    const up = _isUp(ev.inputs);
    const down = _isDown(ev.inputs);
    const left = _isLeft(ev.inputs);
    const right = _isRight(ev.inputs);

    switch (_directionFor(ev.which)) {
      case "up":
        entity.accel.yAccel = _accelFor(entity.control.yAccel, up, down);

        if (entity.accel.yAccel < 0) {
          entity.movement.ySpeed = Math.min(entity.movement.ySpeed, 0);
          entity.send("start-up", new ControlEvent("start-up"));
        } else {
          entity.movement.ySpeed = Math.max(entity.movement.ySpeed, 0);

          if (entity.accel.xAccel < 0) {
            entity.send("start-left", new ControlEvent("start-left"));
          } else if (entity.accel.xAccel > 0) {
            entity.send("start-right", new ControlEvent("start-right"));
          } else {
            entity.send("stop-up", new ControlEvent("stop-up"));
          }
        }

        break;
      case "down":
        entity.accel.yAccel = _accelFor(entity.control.yAccel, up, down);

        if (entity.accel.yAccel > 0) {
          entity.movement.ySpeed = Math.max(entity.movement.ySpeed, 0);
          entity.send("start-down", new ControlEvent("start-down"));
        } else {
          entity.movement.ySpeed = Math.min(entity.movement.ySpeed, 0);

          if (entity.accel.xAccel < 0) {
            entity.send("start-left", new ControlEvent("start-left"));
          } else if (entity.accel.xAccel > 0) {
            entity.send("start-right", new ControlEvent("start-right"));
          } else {
            entity.send("stop-down", new ControlEvent("stop-down"));
          }
        }

        break;
      case "left":
        entity.accel.xAccel = _accelFor(entity.control.xAccel, left, right);

        if (entity.accel.xAccel < 0) {
          entity.movement.xSpeed = Math.min(entity.movement.xSpeed, 0);
          entity.send("start-left", new ControlEvent("start-left"));
        } else {
          entity.movement.xSpeed = Math.max(entity.movement.xSpeed, 0);

          if (entity.accel.yAccel < 0) {
            entity.send("start-up", new ControlEvent("start-up"));
          } else if (entity.accel.yAccel > 0) {
            entity.send("start-down", new ControlEvent("start-down"));
          } else {
            entity.send("stop-left", new ControlEvent("stop-left"));
          }
        }

        break;
      case "right":
        entity.accel.xAccel = _accelFor(entity.control.xAccel, left, right);

        if (entity.accel.xAccel > 0) {
          entity.movement.xSpeed = Math.max(entity.movement.xSpeed, 0);
          entity.send("start-right", new ControlEvent("start-right"));
        } else {
          entity.movement.xSpeed = Math.min(entity.movement.xSpeed, 0);

          if (entity.accel.yAccel < 0) {
            entity.send("start-up", new ControlEvent("start-up"));
          } else if (entity.accel.yAccel > 0) {
            entity.send("start-down", new ControlEvent("start-down"));
          } else {
            entity.send("stop-right", new ControlEvent("stop-right"));
          }
        }

        break;
    }
  });

  entity.on("keyup", (ev: InputEventData) => {
    const up = _isUp(ev.inputs);
    const down = _isDown(ev.inputs);
    const left = _isLeft(ev.inputs);
    const right = _isRight(ev.inputs);

    switch (_directionFor(ev.which)) {
      case "up":
        entity.accel.yAccel = _accelFor(entity.control.yAccel, up, down);

        if (entity.accel.yAccel > 0) {
          entity.send("start-down", new ControlEvent("start-down"));
        } else if (entity.accel.xAccel < 0) {
          entity.send("start-left", new ControlEvent("start-left"));
        } else if (entity.accel.xAccel > 0) {
          entity.send("start-right", new ControlEvent("start-right"));
        } else {
          entity.send("stop-up", new ControlEvent("stop-up"));
        }

        break;
      case "down":
        entity.accel.yAccel = _accelFor(entity.control.yAccel, up, down);

        if (entity.accel.yAccel < 0) {
          entity.send("start-up", new ControlEvent("start-up"));
        } else if (entity.accel.xAccel < 0) {
          entity.send("start-left", new ControlEvent("start-left"));
        } else if (entity.accel.xAccel > 0) {
          entity.send("start-right", new ControlEvent("start-right"));
        } else {
          entity.send("stop-down", new ControlEvent("stop-down"));
        }

        break;
      case "left":
        entity.accel.xAccel = _accelFor(entity.control.xAccel, left, right);

        if (entity.accel.xAccel > 0) {
          entity.send("start-right", new ControlEvent("start-right"));
        } else if (entity.accel.yAccel < 0) {
          entity.send("start-up", new ControlEvent("start-up"));
        } else if (entity.accel.yAccel > 0) {
          entity.send("start-down", new ControlEvent("start-down"));
        } else {
          entity.send("stop-left", new ControlEvent("stop-left"));
        }

        break;
      case "right":
        entity.accel.xAccel = _accelFor(entity.control.xAccel, left, right);

        if (entity.accel.xAccel < 0) {
          entity.send("start-left", new ControlEvent("start-left"));
        } else if (entity.accel.yAccel < 0) {
          entity.send("start-up", new ControlEvent("start-up"));
        } else if (entity.accel.yAccel > 0) {
          entity.send("start-down", new ControlEvent("start-down"));
        } else {
          entity.send("stop-right", new ControlEvent("stop-right"));
        }

        break;
    }
  });
}

function _directionFor(which: string): "up" | "down" | "left" | "right" | "" {
  switch (which) {
    case "ArrowLeft":
    case "A":
      return "left";
    case "ArrowRight":
    case "D":
      return "right";
    case "ArrowUp":
    case "W":
      return "up";
    case "ArrowDown":
    case "S":
      return "down";
    default:
      return "";
  }
}

function _accelFor(accel: number, neg: boolean, pos: boolean): number {
  return (neg ? -accel : 0) + (pos ? accel : 0);
}

function _isUp(state: InputStateIndex): boolean {
  return !!(state["ArrowUp"] || state["W"]);
}

function _isDown(state: InputStateIndex): boolean {
  return !!(state["ArrowDown"] || state["S"]);
}

function _isLeft(state: InputStateIndex): boolean {
  return !!(state["ArrowLeft"] || state["A"]);
}

function _isRight(state: InputStateIndex): boolean {
  return !!(state["ArrowRight"] || state["D"]);
}
