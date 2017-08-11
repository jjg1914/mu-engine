import { shapeFor } from "../util/shape";
import { CollisionEntity } from "../util/collision";
import { MoveEventData } from "../modules/move-module";
import {
  CollisionEventData,
  ResolutionEventData,
} from "../modules/collision-module";
import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";

export interface MoveEntity extends Entity {
  position: PositionData;
  movement: MovementData;
}

export function MoveSystem(klass: Constructor<MoveEntity>)
: Constructor<MoveEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      const _bumps: CollisionEntity[] = [];

      this.on("move", (event: MoveEventData) => {
        let xSpeed = this.movement.xSpeed * event.dt;
        let ySpeed = this.movement.ySpeed * event.dt;

        if (this.position.landing != null &&
            this.position.landing.movement != null) {
          xSpeed += this.position.landing.movement.xChange * 1000;
          ySpeed += this.position.landing.movement.yChange * 1000;
        }

        let oldX = this.position.x;
        let oldY = this.position.y;

        if (xSpeed !== 0) {
          this.movement.xSubpixel += Math.floor(xSpeed);
          this.position.x += Math.trunc(this.movement.xSubpixel / 1000);
          this.movement.xSubpixel = Math.trunc(this.movement.xSubpixel % 1000);
        } else {
          this.movement.xSubpixel = 0;
        }

        if (ySpeed !== 0) {
          this.movement.ySubpixel += Math.floor(ySpeed);
          this.position.y += Math.trunc(this.movement.ySubpixel / 1000);
          this.movement.ySubpixel = Math.trunc(this.movement.ySubpixel % 1000);
        } else {
          this.movement.ySubpixel = 0;
        }

        if (this.position.landing != null) {
          const shape = shapeFor(this.position.landing);       
          const bounds = shapeFor(this).bounds();
          const height = bounds.bottom - bounds.top + 1;
          const min = shape.minimum(bounds.left, bounds.right);

          // min can be infinite if we're in the process of exiting the landing
          if (isFinite(min)) {
            this.position.y = Math.trunc(min - height);
          }
        }

        this.movement.xChange = this.position.x - oldX;
        this.movement.yChange = this.position.y - oldY;

        if (this.movement.restrict) {
          const b = shapeFor(this).bounds();
          const w = b.right - b.left + 1;
          const h = b.bottom - b.top + 1;
          const oldX = this.position.x;
          const oldY = this.position.y;

          this.position.x = Math.min(Math.max(event.bounds.left, b.left),
                                     event.bounds.right - w);
          if (this.position.x !== oldX) {
            this.movement.xSpeed = 0;
          }

          this.position.y = Math.min(Math.max(event.bounds.top, b.top),
                                     event.bounds.bottom - h);
          if (this.position.y !== oldY) {
            this.movement.ySpeed = 0;
          }
        }
      });

      this.on("postcollision", (event: CollisionEventData) => {
        if (!this.position.ignoreSolid) {
          const b1 = shapeFor(this).bounds();
          b1.top = b1.bottom + 1;
          b1.bottom += 2;
          const s = (this.position.landing == null ? _bumps :
                     event.data.queryBounds(b1, this.id).map((f) => f.entity));

          let d = -Infinity;
          let d2 = Infinity;
          let m = null;

          for (let e of s) {
            if (e.position.solid) {
              const shape = shapeFor(e);
              const bounds = shapeFor(this).bounds();
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

          this.position.landing = m;
        }

        _bumps.length = 0;
      });

      this.on("bump", (event: ResolutionEventData) => {
        if (event.mtv[1] <= 0) {
          _bumps.push(event.target);
        }
      });
    }
  }
}
