import { shapeFor } from "../modules/shape";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";
import { CollisionData } from "../components/collision-component";
import { CollisionEntity } from "../util/collision";
import { CollisionEventData } from "../events/collision-event";
import { ResolutionEventData } from "../events/resolution-event";
import { LandingEvent } from "../events/landing-event";

export interface LandingEntity extends Entity {
  position: PositionData;
  movement: MovementData;
  collision: CollisionData;
}

export function LandingSystem(entity: LandingEntity): void {
  const _bumps: CollisionEntity[] = [];

  entity.on("premove", () => {
    if (entity.collision.landing != null &&
        entity.collision.landing.movement != null) {
      if (entity.movement.xSpeed === 0) {
        entity.movement.xSubpixel = entity.collision.landing.movement.xSubpixel;
      }

      if (entity.movement.ySpeed === 0) {
        entity.movement.ySubpixel = entity.collision.landing.movement.ySubpixel;
      }
    }
  });

  entity.on("move", () => {
    if (entity.collision.landing != null) {
      const shape = shapeFor(entity.collision.landing);       
      const bounds = shapeFor(entity).bounds();
      const height = bounds.bottom - bounds.top + 1;
      const min = shape.minimum(bounds.left, bounds.right);

      // min can be infinite if we're in the process of exiting the landing
      if (isFinite(min)) {
        entity.position.y = Math.trunc(min - height);
      }
    }
  });

  entity.on("bump", (event: ResolutionEventData) => {
    if (event.mtv[1] <= 0) {
      _bumps.push(event.target);
    }
  });

  entity.on("postcollision", (event: CollisionEventData) => {
    if (!entity.collision.ignoreSolid) {
      const b1 = shapeFor(entity).bounds();
      b1.top = b1.bottom + 1;
      b1.bottom += 2;
      const s = (entity.collision.landing == null ? _bumps :
                 event.data.queryBounds(b1, entity.id).map((f) => f.entity));

      let d = -Infinity;
      let d2 = Infinity;
      let d3 = Infinity;
      let m = null;

      for (let e of s) {
        if (e.collision.solid) {
          const shape = shapeFor(e);
          const bounds = shapeFor(entity).bounds();
          const min = shape.minimum(bounds.left, bounds.right);

          const u = e.collision.solid instanceof Array ? e.collision.solid[1] : 0;

          const b2 = shape.bounds();
          const v = Math.abs(Math.min(b1.right, b2.right) -
                             Math.max(b1.left, b2.left));
          if (min >= bounds.bottom - 1 && min < d2 || (min === d2 && v > d) && u < d3) {
            d = v;
            d2 = min;
            d3 = u;
            m = e;
          }
        }
      }

      if (m != null && entity.collision.landing !== m) {
        entity.collision.landing = m;
        m.send("landing", new LandingEvent(entity));
      } else {
        entity.collision.landing = m;
      }
    } else {
      entity.collision.landing = undefined;
    }

    _bumps.length = 0;
  });
}
