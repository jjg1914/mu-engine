import { shapeFor } from "../util/shape";
import { CollisionEntity } from "../util/collision";
import { MoveEventData } from "../modules/move-module";
import {
  CollisionEventData,
  ResolutionEventData,
} from "../modules/collision-module";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface MoveEntity extends Entity {
  position: PositionData;
  movement: MovementData;
}

export function MoveSystem(entity: MoveEntity): void {
  const _bumps: CollisionEntity[] = [];

  entity.on("move", (event: MoveEventData) => {
    let xSpeed = entity.movement.xSpeed * event.dt;
    let ySpeed = entity.movement.ySpeed * event.dt;

    if (entity.position.landing != null &&
        entity.position.landing.movement != null) {
      xSpeed += entity.position.landing.movement.xChange * 1000;
      ySpeed += entity.position.landing.movement.yChange * 1000;
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

    if (entity.position.landing != null) {
      const shape = shapeFor(entity.position.landing);       
      const bounds = shapeFor(entity).bounds();
      const height = bounds.bottom - bounds.top + 1;
      const min = shape.minimum(bounds.left, bounds.right);

      // min can be infinite if we're in the process of exiting the landing
      if (isFinite(min)) {
        entity.position.y = Math.trunc(min - height);
      }
    }

    entity.movement.xChange = entity.position.x - oldX;
    entity.movement.yChange = entity.position.y - oldY;

    if (entity.movement.restrict) {
      const b = shapeFor(entity).bounds();
      const w = b.right - b.left + 1;
      const h = b.bottom - b.top + 1;
      const oldX = entity.position.x;
      const oldY = entity.position.y;

      entity.position.x = Math.min(Math.max(event.bounds.left, b.left),
                                 event.bounds.right - w);
      if (entity.position.x !== oldX) {
        entity.movement.xSpeed = 0;
      }

      entity.position.y = Math.min(Math.max(event.bounds.top, b.top),
                                 event.bounds.bottom - h);
      if (entity.position.y !== oldY) {
        entity.movement.ySpeed = 0;
      }
    }
  });

  entity.on("postcollision", (event: CollisionEventData) => {
    if (!entity.position.ignoreSolid) {
      const b1 = shapeFor(entity).bounds();
      b1.top = b1.bottom + 1;
      b1.bottom += 2;
      const s = (entity.position.landing == null ? _bumps :
                 event.data.queryBounds(b1, entity.id).map((f) => f.entity));

      let d = -Infinity;
      let d2 = Infinity;
      let m = null;

      for (let e of s) {
        if (e.position.solid) {
          const shape = shapeFor(e);
          const bounds = shapeFor(entity).bounds();
          const min = shape.minimum(bounds.left, bounds.right);

          const b2 = shape.bounds();
          const v = Math.abs(Math.min(b1.right, b2.right) -
                             Math.max(b1.left, b2.left));
          if (min < d2 || v > d) {
            d = v;
            d2 = min;
            m = e;
          }
        }
      }

      entity.position.landing = m;
    }

    _bumps.length = 0;
  });

  entity.on("bump", (event: ResolutionEventData) => {
    if (event.mtv[1] <= 0) {
      _bumps.push(event.target);
    }
  });
}
