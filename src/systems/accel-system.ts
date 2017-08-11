import { MoveEventData } from "../modules/move-module";
import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface AccelEntity extends Entity {
  position: PositionData;
  movement: MovementData;
}

export function AccelSystem(klass: Constructor<AccelEntity>)
: Constructor<AccelEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      this.on("premove", (event: MoveEventData) => {
        let friction = this.movement.friction;
        let g = (this.position.landing == null ? event.gravity : 0);

        if (this.position.landing != null &&
            this.position.landing.movement != null) {
          friction = this.position.landing.movement.friction;
        }

        const dt = event.dt / 1000;

        this.movement.xSpeed = _accel(dt, this.movement.xSpeed,
                                      this.movement.xAccel,
                                      this.movement.xMax,
                                      friction);

        this.movement.ySpeed = _accel(dt, this.movement.ySpeed,
                                      this.movement.yAccel + g,
                                      this.movement.yMax,
                                      friction);

        if (this.movement.xAccel) {
          let [ a, s ] = [ this.movement.xAccel, this.movement.xSpeed ];

          this.movement.xSpeed = (a < 0 ? Math.min(s, 0) : Math.max(s, 0));
        }

        if (this.movement.xSpeed === 0 &&
            this.position.landing != null &&
            this.position.landing.movement != null) {
          this.movement.xSubpixel = this.position.landing.movement.xSubpixel;
          this.movement.ySubpixel = this.position.landing.movement.ySubpixel;
        }
      });
    }
  };
}

function _accel(dt: number,
                speed: number,
                accel: number,
                max: number | null,
                friction: number | null): number {
  if (accel !== 0) {
    speed += accel * dt;

    if (max != null) {
      speed = Math.max(Math.min(speed, max), -max);
    }
  } else if (speed !== 0) {
    if (friction != null) {
      if (Math.abs(speed) < friction * dt) {
        speed = 0;
      } else {
        speed += friction * dt * (speed > 0 ? -1 : 1)
      }
    } else {
      speed = 0;
    }
  }

  return speed;
}
