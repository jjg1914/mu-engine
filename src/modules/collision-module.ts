import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
import { Bounds } from "../util/shape";
import { Collision, CollisionEntity, Vector } from "../util/collision";

export interface CollisionEventData {
  type: "precollision" | "postcollision";
  data: Collision;
}

export interface ResolutionEventData {
  type: "collision" | "bump";
  target: CollisionEntity;
  mtv: Vector;
}

export class CollisionEvent implements CollisionEventData {
  type: "precollision" | "postcollision";
  data: Collision;

  constructor(type: "precollision" | "postcollision", data: Collision) {
    this.type = type;
    this.data = data;
  }
}

export class ResolutionEvent implements ResolutionEventData {
  type: "collision" | "bump";
  target: CollisionEntity;
  mtv: Vector;

  constructor(type: "collision" | "bump",
              target: CollisionEntity,
              mtv: Vector) {
    this.type = type;
    this.target = target;
    this.mtv = mtv;
  }
}

export interface CollisionConfig {
  collision: {
    bounds: Bounds;
  }
}

interface TranslationData {
  entity: CollisionEntity;
  mtv: Vector;
}

export function CollisionModule(klass: Constructor<Entity>)
: Constructor<Entity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);
      const config: CollisionConfig = args[0];

      this.on("interval", () => {
        const collision = new Collision(config.collision.bounds);

        this.send("precollision", new CollisionEvent("precollision",
                                                     collision));

        const translations: TranslationData[] = [];

        for (let e of collision) {
          let xTarget = null, yTarget = null;
          let xD = -Infinity, yD = -Infinity;

          for (let c of collision.query(e)) {
            // only resolve collision for solids
            if (!e.position.ignoreSolid && c.entity.position.solid) {
              // support solids that allow passing through in a certain direction.
              // need to determine which direction the entity is contacted in.
              let [ xMask, yMask ] = (c.entity.position.solid instanceof Array) ?
                c.entity.position.solid : [ 0, 0 ];
              let [ xOtherChange, yOtherChange ] = (c.entity.movement != null) ?
                [ c.entity.movement.xChange, c.entity.movement.yChange ] :
                [ 0, 0 ];
              let [ xSelfChange, ySelfChange ] = (e.movement != null) ?
                [ e.movement.xChange, e.movement.yChange ] :
                [ 0, 0 ];
              let xChange = xSelfChange - xOtherChange;
              let yChange = ySelfChange - yOtherChange;

              let target = null;
              let d = Infinity;

              // find the translation vector of minimum magnitude for a valid
              // direction of intsersection
              for (let i = 0; i < c.vectorData.length; ++i) {
                let [ adjustedX, adjustedY ] = c.vectorData[i];

                if (xMask != null) {
                  if (!((xMask === 0 || Math.sign(xChange) === xMask) &&
                      Math.abs(xChange) >= Math.abs(adjustedX) &&
                      Math.sign(xChange) === -Math.sign(adjustedX) &&
                      xChange !== 0)) {
                    adjustedX = 0;
                  }
                } else {
                  adjustedX = 0;
                }

                if (yMask != null) {
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

              if (target != null) {
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
              let target = null;
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

              if (target != null) {
                e.send("collision", new ResolutionEvent("collision",
                                                        c.entity, target));
              }
            }
          } // end collision loop

          if (xTarget != null && yTarget != null) {
            translations.push({
              entity: e,
              mtv: [ xTarget.mtv[0], yTarget.mtv[1] ],
            });

            e.send("bump", new ResolutionEvent("bump",
                                               xTarget.entity, xTarget.mtv));

            if (xTarget !== yTarget) {
              e.send("bump", new ResolutionEvent("bump",
                                                 yTarget.entity, yTarget.mtv));
            }
          } else if (xTarget != null) {
            translations.push({
              entity: e,
              mtv: xTarget.mtv,
            });

            e.send("bump", new ResolutionEvent("bump",
                                               xTarget.entity, xTarget.mtv));
          } else if (yTarget != null) {
            translations.push({
              entity: e,
              mtv: yTarget.mtv,
            });

            e.send("bump", new ResolutionEvent("bump",
                                               yTarget.entity, yTarget.mtv));
          }
        }

        this.send("postcollision", new CollisionEvent("postcollision",
                                                       collision));

        for (let t of translations) {
          if (t.mtv[0] !== 0) {
            t.entity.position.x = Math.trunc(t.entity.position.x + t.mtv[0]);
          }

          if (t.mtv[1] !== 0) {
            t.entity.position.y = Math.trunc(t.entity.position.y + t.mtv[1]);
          }

          if (t.entity.movement != null)  {
            if (t.mtv[0] !== 0) {
              t.entity.movement.xSubpixel = 0;
            }

            if (t.mtv[1] !== 0) {
              t.entity.movement.ySubpixel = 0;
            }

            if (t.mtv[0] > 0) {
              t.entity.movement.xSpeed = Math.max(t.entity.movement.xSpeed, 0)
            } else if (t.mtv[0] < 0) {
              t.entity.movement.xSpeed = Math.min(t.entity.movement.xSpeed, 0)
            }

            if (t.mtv[1] > 0) {
              t.entity.movement.ySpeed = Math.max(t.entity.movement.ySpeed, 0)
            } else if (t.mtv[1] < 0) {
              t.entity.movement.ySpeed = Math.min(t.entity.movement.ySpeed, 0)
            }
          }
        }
      });
    }
  }
}
