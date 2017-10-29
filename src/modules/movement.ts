export interface GravityData {
  accel: { nogravity: boolean };
  collision: { landing?: {} };
}

export function gravityFor(entity: GravityData, config: { gravity: number })
: number {
  if (!entity.accel.nogravity && entity.collision.landing == undefined) {
    return config.gravity;
  } else {
    return 0;
  }
}

export interface FrictionData {
  accel: { drag?: number, nofriction: boolean };
  collision: { landing?: { accel?: { friction?: number } } };
}

export function frictionFor(entity: FrictionData): number | undefined {
  if (!entity.accel.nofriction) {
    if (entity.collision.landing != null &&
        entity.collision.landing.accel != null &&
        entity.collision.landing.accel.friction != null) {
      return entity.collision.landing.accel.friction;
    } else {
      return entity.accel.drag;
    }
  } else {
    return undefined;
  }
}

export function speedFor(dt: number,
                         speed: number,
                         accel: number,
                         friction?: number)
: number {
  if (accel !== 0) {
    return accelerate(dt, speed, accel);
  } else {
    return decelerate(dt, speed, friction);
  }
}

export function accelerate(dt: number, speed: number, accel: number): number {
  return speed + accel * dt;
}

export function decelerate(dt: number, speed: number, friction?: number): number {
  if (speed !== 0 && friction != undefined) {
    const f = friction * dt;

    if (Math.abs(speed) > f) {
      return speed - f * (speed > 0 ? 1 : -1);
    } else {
      return 0;
    }
  } else {
    return speed;
  }
}

export function restrict(speed: number, max?: number | [ number, number ])
: number {
  if (max != null) {
    if (max instanceof Array) {
      return Math.max(Math.min(speed, max[1]), max[0]);
    } else {
      return Math.max(Math.min(speed, max), -max);
    }
  } else {
    return speed;
  }
}
