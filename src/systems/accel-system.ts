import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface AccelEntity extends Entity {
  position: PositionData;
  movement: MovementData;
}

export function AccelSystem(entity: AccelEntity): void {
  entity.on("premove", (event: MoveEventData) => {
    let friction = entity.movement.drag;
    let g = !entity.movement.nogravity && entity.position.landing == null ?
            event.gravity : 0;

    if (entity.position.landing != null &&
        entity.position.landing.movement != null &&
        entity.position.landing.movement.friction != null) {
      friction = entity.position.landing.movement.friction;
    }

    const dt = event.dt / 1000;

    entity.movement.xSpeed = _accel(dt, entity.movement.xSpeed,
                                    entity.movement.xAccel,
                                    entity.movement.xMax,
                                    friction,
                                    entity.movement.nofriction);

    entity.movement.ySpeed = _accel(dt, entity.movement.ySpeed,
                                    entity.movement.yAccel + g,
                                    entity.movement.yMax,
                                    friction,
                                    entity.movement.nofriction);

    if (entity.movement.xAccel) {
      let [ a, s ] = [ entity.movement.xAccel, entity.movement.xSpeed ];

      entity.movement.xSpeed = (a < 0 ? Math.min(s, 0) : Math.max(s, 0));
    }

    if (entity.movement.xSpeed === 0 &&
        entity.position.landing != null &&
        entity.position.landing.movement != null) {
      entity.movement.xSubpixel = entity.position.landing.movement.xSubpixel;
      entity.movement.ySubpixel = entity.position.landing.movement.ySubpixel;
    }
  });
}

function _accel(dt: number,
                speed: number,
                accel: number,
                max: number | null,
                friction: number | null,
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
