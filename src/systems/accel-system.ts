import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { AccelData } from "../components/accel-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";

import {
  frictionFor,
  gravityFor,
  speedFor,
  restrict,
} from "../modules/movement";

export interface AccelEntity extends Entity {
  accel: AccelData;
  movement: MovementData;
  collision: CollisionData;
}

export function AccelSystem(entity: AccelEntity): void {
  entity.on("premove", (event: MoveEventData) => {
    const dt = event.dt / 1000;

    const f = frictionFor(entity);
    const g = gravityFor(entity, event);

    let xSpeed = entity.movement.xSpeed;
    xSpeed = speedFor(dt, xSpeed, entity.accel.xAccel, f);
    entity.movement.xSpeed = (entity.accel.restrict ?
                              restrict(xSpeed, entity.movement.xMax) :
                              xSpeed);

    let ySpeed = entity.movement.ySpeed;
    ySpeed = speedFor(dt, ySpeed, entity.accel.yAccel + g, f);
    entity.movement.ySpeed = (entity.accel.restrict ?
                              restrict(ySpeed, entity.movement.yMax) :
                              ySpeed);
  });
}
