import Collision from "../util/collision";
import { shapeFor } from "../util/shape";

export default class CollisionSystem {
  constructor(bounds) {
    this._bounds = bounds;
  }

  interval(event, engine) {
    const collision = new Collision(this._bounds);
    const translations = [];

    engine.run([ "position" ], (e) => {
      collision.add(e);
    });

    engine.run([ "position" ], (e) => {
      if (e.position.solid) {
        return;
      }

      let xTarget = null, yTarget = null;
      let xD = Infinity, yD = Infinity;

      let b1 = shapeFor(e).bounds();

      for (let c of collision.query(e)) {
        if (!e.position.ignoreSolid && c.entity.position.solid) {
          let masks = c.entity.position.solid;

          if (masks instanceof Array && (masks[0] !== 0 || masks[1] !== 0)) {
            let b2 = shapeFor(c.entity).bounds();

            let [ xMask, yMask ] = (c.entity.position.solid instanceof Array) ?
              c.entity.position.solid : [ 0, 0 ];
            let [ xChange, yChange ] = (e.movement != null) ?
              [ e.movement.xChange, e.movement.yChange ] : [ 0, 0 ];
            let [ xOtherChange, yOtherChange ] = (c.entity.movement != null) ?
              [ c.entity.movement.xChange, c.entity.movement.yChange ] :
              [ 0, 0 ];
            
            if (xMask >= 0) {
              let d = b1.right- b2.left;

              if (d > 0 && xChange + -xOtherChange >= d && d < xD) {
                xTarget = { entity: c.entity, mtv: [ d, 0 ] };
                xD = d;
              }
            }
            
            if (xMask <= 0) {
              let d = b1.left - b2.right;

              if (d < 0 && xChange + -xOtherChange <= d && -d < yD) {
                xTarget = { entity: c.entity, mtv: [ d, 0 ] };
                xD = -d;
              }
            }
            
            if (yMask >= 0) {
              let d = b1.bottom - b2.top;

              if (d > 0 && yChange + -yOtherChange >= d && d < yD) {
                yTarget = { entity: c.entity, mtv: [ 0, d ] };
                yD = d;
              }
            }
            
            if (yMask <= 0) {
              let d = b1.top - b2.bottom;

              if (d < 0 && yChange + -yOtherChange <= d && -d < yD) {
                yTarget = { entity: c.entity, mtv: [ 0, d ] };
                yD = -d;
              }
            }
          } else {
            if (c.mtv[0] !== 0 && Math.abs(c.mtv[0] < xD)) {
              xTarget = c;
              xD = Math.abs(c.mtv[0]);
            }

            if (c.mtv[1] !== 0 && Math.abs(c.mtv[1] < yD)) {
              yTarget = c;
              yD = Math.abs(c.mtv[1]);
            }
          }
        } else {
          engine.emit({
            type: "collision",
            entity: e,
            mtv: c.mtv,
            target: c.entity,
          });
        }
      }

      if (xTarget != null) {
        translations.push({
          entity: e,
          mtv: xTarget.mtv,
          target: xTarget.entity,
        });

        engine.emit({
          type: "bump",
          entity: e,
          target: xTarget.entity,
          mtv: xTarget.mtv,
        });
      }

      if (yTarget != null) {
        translations.push({
          entity: e,
          mtv: yTarget.mtv,
          target: yTarget.entity,
        });

        engine.emit({
          type: "bump",
          entity: e,
          target: yTarget.entity,
          mtv: yTarget.mtv,
        });
      }
    });

    engine.emit({
      type: "postcollision",
      data: collision,
    });

    for (let t of translations) {
      if (t.mtv[0] !== 0) {
        t.entity.position.x = Math.trunc(t.entity.position.x - t.mtv[0]);
      }

      if (t.mtv[1] !== 0) {
        t.entity.position.y = Math.trunc(t.entity.position.y - t.mtv[1]);
      }

      if (t.entity.movement != null)  {
        if (t.mtv[0] < 0) {
          t.entity.movement.xSpeed = Math.max(t.entity.movement.xSpeed, 0)
        } else if (t.mtv[0] > 0) {
          t.entity.movement.xSpeed = Math.min(t.entity.movement.xSpeed, 0)
        }

        if (t.mtv[1] < 0) {
          t.entity.movement.ySpeed = Math.max(t.entity.movement.ySpeed, 0)
        } else if (t.mtv[1] > 0) {
          t.entity.movement.ySpeed = Math.min(t.entity.movement.ySpeed, 0)
        }
      }
    }
  }
}
