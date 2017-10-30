import { Entity } from "../entities/entity";
import { Bounds } from "../util/shape";
import { Collision, CollisionEntity, Vector } from "../util/collision";
import { CollisionEvent } from "../events/collision-event";
import { ResolutionEvent } from "../events/resolution-event";

export interface CollisionConfig {
  bounds: Bounds;
}

interface TranslationData {
  entity: CollisionEntity;
  mtv: Vector;
}

export function CollisionMediatorSystem(entity: Entity,
                                        config: CollisionConfig)
: void {
  entity.on("interval", () => {
    const collision = new Collision(config.bounds);

    entity.send("precollision", new CollisionEvent("precollision",
                                                   collision));

    const translations: TranslationData[] = [];

    for (let e of collision) {
      let xTarget;
      let yTarget;
      let xD = -Infinity;
      let yD = -Infinity;

      const query = collision.query(e);
      const visits = {} as { [ key: number ]: boolean };
      for (let c of query) {
        // only resolve collision for solids
        if (!e.collision.ignoreSolid && c.entity.collision.solid) {
          // support solids that allow passing through in a certain direction.
          // need to determine which direction the entity is contacted in.
          let xMask = 0;
          let yMask = 0;
          let xOtherChange = 0;
          let yOtherChange = 0;
          let xSelfChange = 0;
          let ySelfChange = 0;

          if (c.entity.collision.solid instanceof Array) {
            xMask = c.entity.collision.solid[0];
            yMask = c.entity.collision.solid[1];
          }

          if (e.movement !== undefined) {
            xSelfChange = e.movement.xChange;
            ySelfChange = e.movement.yChange;
          }

          if (c.entity.movement !== undefined) {
            xOtherChange = c.entity.movement.xChange;
            yOtherChange = c.entity.movement.yChange;
          }

          let xChange = xSelfChange - xOtherChange;
          let yChange = ySelfChange - yOtherChange;

          let target;
          let d = Infinity;

          // find the translation vector of minimum magnitude for a valid
          // direction of intsersection
          for (let i = 0; i < c.vectorData.length; ++i) {
            let [ adjustedX, adjustedY ] = c.vectorData[i];

            if (!isNaN(xMask)) {
              if (!((xMask === 0 || Math.sign(xChange) === xMask) &&
                  Math.abs(xChange) >= Math.abs(adjustedX) &&
                  Math.sign(xChange) === -Math.sign(adjustedX) &&
                  xChange !== 0)) {
                adjustedX = 0;
              }
            } else {
              adjustedX = 0;
            }

            if (!isNaN(yMask)) {
              if (!((yMask === 0 || Math.sign(yChange) === yMask) &&
                  Math.abs(yChange) >= Math.abs(adjustedY) &&
                  Math.sign(yChange) === -Math.sign(adjustedY) &&
                  yChange !== 0)) {
                adjustedY = 0;
              }
            } else {
              adjustedY = 0;
            }

            let tmpD = Math.abs(adjustedX) + Math.abs(adjustedY);
            if (tmpD > 0 && tmpD < d) {
              target = {
                entity: c.entity,
                mtv: [ adjustedX, adjustedY ] as Vector,
              };
              d = tmpD;
            }
          }

          if (target !== undefined) {
            if (target.mtv[0] !== 0 && Math.abs(target.mtv[0]) > xD) {
              xTarget = target;
              xD = Math.abs(target.mtv[0]);
            }

            if (target.mtv[1] !== 0 && Math.abs(target.mtv[1]) > yD) {
              yTarget = target;
              yD = Math.abs(target.mtv[1]);
            }
          }
        } else {
          let target;
          let d = Infinity;

          for (let i = 0; i < c.vectorData.length; ++i) {
            const x = c.vectorData[i][0];
            const y = c.vectorData[i][1];
            const tmpD = Math.sqrt(x * x + y * y) ;

            if (tmpD < d) {
              target = c.vectorData[i] as Vector;
              d = tmpD;
            }
          }

          if (target !== undefined) {
            visits[c.entity.id] = true;
            e.send("collision", new ResolutionEvent("collision",
                                                    c.entity, target));
          }
        }
      } // end collision loop

      if (xTarget !== undefined && yTarget !== undefined) {
        translations.push({
          entity: e,
          mtv: [ xTarget.mtv[0], yTarget.mtv[1] ],
        });

        visits[xTarget.entity.id] = true;
        e.send("bump", new ResolutionEvent("bump",
                                           xTarget.entity, xTarget.mtv));

        if (xTarget !== yTarget) {
          visits[yTarget.entity.id] = true;
          e.send("bump", new ResolutionEvent("bump",
                                             yTarget.entity, yTarget.mtv));
        }
      } else if (xTarget !== undefined) {
        translations.push({
          entity: e,
          mtv: xTarget.mtv,
        });

        visits[xTarget.entity.id] = true;
        e.send("bump", new ResolutionEvent("bump",
                                           xTarget.entity, xTarget.mtv));
      } else if (yTarget !== undefined) {
        translations.push({
          entity: e,
          mtv: yTarget.mtv,
        });

        visits[yTarget.entity.id] = true;
        e.send("bump", new ResolutionEvent("bump",
                                           yTarget.entity, yTarget.mtv));
      }

      for (let c of query) {
        if (!visits[c.entity.id]) {
          let target;
          let d = Infinity;

          for (let i = 0; i < c.vectorData.length; ++i) {
            const x = c.vectorData[i][0];
            const y = c.vectorData[i][1];
            const tmpD = Math.sqrt(x * x + y * y) ;

            if (tmpD < d) {
              target = c.vectorData[i] as Vector;
              d = tmpD;
            }
          }

          if (target !== undefined) {
            visits[c.entity.id] = true;
            e.send("collision", new ResolutionEvent("collision",
                                                    c.entity, target));
          }
        }
      }
    }

    entity.send("postcollision", new CollisionEvent("postcollision",
                                                     collision));

    for (let t of translations) {
      if (t.mtv[0] !== 0) {
        t.entity.position.x = Math.trunc(t.entity.position.x + t.mtv[0]);
      }

      if (t.mtv[1] !== 0) {
        t.entity.position.y = Math.trunc(t.entity.position.y + t.mtv[1]);
      }

      if (t.entity.movement !== undefined) {
        if (t.mtv[0] !== 0) {
          t.entity.movement.xSubpixel = 0;
        }

        if (t.mtv[1] !== 0) {
          t.entity.movement.ySubpixel = 0;
        }

        if (t.mtv[0] > 0) {
          t.entity.movement.xSpeed = Math.max(t.entity.movement.xSpeed, 0);
        } else if (t.mtv[0] < 0) {
          t.entity.movement.xSpeed = Math.min(t.entity.movement.xSpeed, 0);
        }

        if (t.mtv[1] > 0) {
          t.entity.movement.ySpeed = Math.max(t.entity.movement.ySpeed, 0);
        } else if (t.mtv[1] < 0) {
          t.entity.movement.ySpeed = Math.min(t.entity.movement.ySpeed, 0);
        }
      }
    }
  });
}
