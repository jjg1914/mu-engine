import Path from "../util/path";
import { shapeFor } from "../util/shape";

export default class MovementSystem {
  constructor(bounds, gravity) {
    this._bounds = bounds;
    this._gravity = gravity;
  }

  interval(event, engine) {
    const dt = event.dt / 1000;

    engine.run([ "path", "position", "movement" ], (e) => {
      if (e.path.t == null) {
        e.path.t = 0;
        e.path.x = e.position.x;
        e.path.y = e.position.y;
      } else {
        e.path.t += event.dt;
      }

      const [ x, y ] = Path(e.path.path,
                            e.path.t,
                            e.path.x,
                            e.path.y,
                            e.path.repeat);
      let oldX = e.position.x;
      let oldY = e.position.y;

      e.position.x = Math.trunc(x);
      e.position.y = Math.trunc(y);

      e.movement.xChange = e.position.x - oldX;
      e.movement.yChange = e.position.y - oldY;
    });

    engine.run([ "!path", "movement" ], (e) => {
      let friction = e.movement.friction;
      let g = (e.position.landing == null ? this._gravity : 0);

      engine.run(e.position.landing, [ "movement" ], (f) => {
        friction = f.movement.friction;
      });

      e.movement.xSpeed = _accel(dt, e.movement.xSpeed,
                                     e.movement.xAccel,
                                     e.movement.xMax,
                                     friction);

      e.movement.ySpeed = _accel(dt, e.movement.ySpeed,
                                     e.movement.yAccel + g,
                                     e.movement.yMax,
                                     friction);

      if (e.movement.xAccel) {
        let [ a, s ] = [ e.movement.xAccel, e.movement.xSpeed ];

        e.movement.xSpeed = (a < 0 ? Math.min(s, 0) : Math.max(s, 0));
      }

      if (e.movement.xSpeed === 0) {
        engine.run(e.position.landing, [ "movement" ], (f) => {
          e.movement.xSubpixel = f.movement.xSubpixel;
          e.movement.ySubpixel = f.movement.ySubpixel;
        });
      }
    });

    engine.run([ "!path", "position", "movement" ], (e) => {
      let xSpeed = e.movement.xSpeed * event.dt;
      let ySpeed = e.movement.ySpeed * event.dt;

      engine.run(e.position.landing, [ "movement" ], (f) => {
        xSpeed += f.movement.xChange * 1000;
        ySpeed += f.movement.yChange * 1000;
      });

      let oldX = e.position.x;
      let oldY = e.position.y;

      if (xSpeed !== 0) {
        e.movement.xSubpixel += Math.floor(xSpeed);
        e.position.x += Math.trunc(e.movement.xSubpixel / 1000);
        e.movement.xSubpixel = Math.trunc(e.movement.xSubpixel % 1000);
      } else {
        e.movement.xSubpixel = 0;
      }

      if (ySpeed !== 0) {
        e.movement.ySubpixel += Math.floor(ySpeed);
        e.position.y += Math.trunc(e.movement.ySubpixel / 1000);
        e.movement.ySubpixel = Math.trunc(e.movement.ySubpixel % 1000);
      } else {
        e.movement.ySubpixel = 0;
      }

      e.movement.xChange = e.position.x - oldX;
      e.movement.yChange = e.position.y - oldY;

      if (e.movement.restrict) {
        const b = shapeFor(e).bounds();
        const w = b.right - b.left;
        const h = b.bottom - b.top;
        const oldX = e.position.x;
        const oldY = e.position.y;

        e.position.x = Math.min(Math.max(this._bounds.left, b.left),
                                this._bounds.right - w);
        if (e.position.x !== oldX) {
          e.movement.xSpeed = 0;
        }

        e.position.y = Math.min(Math.max(this._bounds.top, b.top),
                                this._bounds.bottom - h);
        if (e.position.y !== oldY) {
          e.movement.ySpeed = 0;
        }
      }
    });
  }
}

function _accel(dt, speed, accel, max, friction) {
  if (accel !== 0) {
    speed += accel * dt;

    if (max != null) {
      speed = Math.max(Math.min(speed, max), -max);
    }
  } else if (speed !== 0) {
    if (friction != null) {
      if (Math.abs(speed) < friction * dt) {
        speed = 0;
      } else {
        speed += friction * dt * (speed > 0 ? -1 : 1)
      }
    } else {
      speed = 0;
    }
  }

  return speed;
}
