import { Keys, InputEventData } from "../modules/input-module";
import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
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

export function Control2WaySystem(klass: Constructor<Control2WayEntity>)
: Constructor<Control2WayEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      this.on("keydown", (event: InputEventData) => {
        switch (event.which) {
        case Keys.ARROW_LEFT:
        case Keys.ARROW_RIGHT:
          this.movement.xAccel += _accel(event.which, this.control.xAccel);
          break;
        case Keys.ARROW_UP:
          if (this.position.landing != null) {
            this.movement.ySpeed = -this.control.jumpSpeed;
            this.position.landing = null;
          }
          break;
        }
      });

      this.on("keyup", (event: InputEventData) => {
        switch (event.which) {
        case Keys.ARROW_LEFT:
        case Keys.ARROW_RIGHT:
          this.movement.xAccel -= _accel(event.which, this.control.xAccel);
          break;
        }
      });
    }
  }
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
