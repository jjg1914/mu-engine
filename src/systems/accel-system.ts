import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { AccelData } from "../components/accel-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";

export interface AccelEntity extends Entity {
  accel: AccelData;
  movement: MovementData;
  collision: CollisionData;
}

export function AccelSystem(entity: AccelEntity): void {
  entity.on("premove", (event: MoveEventData) => {
    let friction = entity.accel.drag;
    let g = !entity.accel.nogravity && entity.collision.landing == null ?
            event.gravity : 0;

    if (entity.collision.landing != null &&
        entity.collision.landing.accel != null &&
        entity.collision.landing.accel.friction != null) {
      friction = entity.collision.landing.accel.friction;
    }

    const dt = event.dt / 1000;

    entity.movement.xSpeed = _accel(dt, entity.movement.xSpeed,
                                    entity.accel.xAccel,
                                    entity.movement.xMax,
                                    friction,
                                    entity.accel.nofriction);

    entity.movement.ySpeed = _accel(dt, entity.movement.ySpeed,
                                    entity.accel.yAccel + g,
                                    entity.movement.yMax,
                                    friction,
                                    entity.accel.nofriction);

    if (entity.accel.xAccel) {
      let [ a, s ] = [ entity.accel.xAccel, entity.movement.xSpeed ];

      entity.movement.xSpeed = (a < 0 ? Math.min(s, 0) : Math.max(s, 0));
    }

    if (entity.movement.xSpeed === 0 &&
        entity.collision.landing != null &&
        entity.collision.landing.movement != null) {
      entity.movement.xSubpixel = entity.collision.landing.movement.xSubpixel;
      entity.movement.ySubpixel = entity.collision.landing.movement.ySubpixel;
    }
  });
}

function _accel(dt: number,
                speed: number,
                accel: number,
                max: number | undefined,
                friction: number | undefined,
                nofriction: boolean): number {
  if (accel !== 0) {
    speed += accel * dt;

    if (max != null) {
      speed = Math.max(Math.min(speed, max), -max);
    }
  } else if (speed !== 0) {
    if (!nofriction && friction != null) {
      if (Math.abs(speed) < friction * dt) {
        speed = 0;
      } else {
        speed += friction * dt * (speed > 0 ? -1 : 1)
      }
    }
  }

  return speed;
}
