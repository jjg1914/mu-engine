import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";

export interface MoveEntity extends Entity {
  position: PositionData;
  movement: MovementData;
  collision: CollisionData;
}

export function MoveSystem(entity: MoveEntity): void {
  entity.on("move", (event: MoveEventData) => {
    let xSpeed = entity.movement.xSpeed * event.dt;
    let ySpeed = entity.movement.ySpeed * event.dt;

    if (entity.collision.landing != null &&
        entity.collision.landing.movement != null) {
      xSpeed += entity.collision.landing.movement.xChange * 1000;
      ySpeed += entity.collision.landing.movement.yChange * 1000;
    }

    let oldX = entity.position.x;
    let oldY = entity.position.y;

    if (xSpeed !== 0) {
      entity.movement.xSubpixel += Math.floor(xSpeed);
      entity.position.x += Math.trunc(entity.movement.xSubpixel / 1000);
      entity.movement.xSubpixel = Math.trunc(entity.movement.xSubpixel % 1000);
    } else {
      entity.movement.xSubpixel = 0;
    }

    if (ySpeed !== 0) {
      entity.movement.ySubpixel += Math.floor(ySpeed);
      entity.position.y += Math.trunc(entity.movement.ySubpixel / 1000);
      entity.movement.ySubpixel = Math.trunc(entity.movement.ySubpixel % 1000);
    } else {
      entity.movement.ySubpixel = 0;
    }

    entity.movement.xChange = entity.position.x - oldX;
    entity.movement.yChange = entity.position.y - oldY;
  });
}
