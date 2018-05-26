import { Entity } from "../entities/entity";
import { IntervalEventData } from "../events/interval-event";

export type EaseAssign = (value: number, done?: boolean) => void;

export function easeLinear(entity: Entity,
                           start: number,
                           end: number,
                           duration: number,
                           cb: EaseAssign): void {
  easeBase(entity, duration, (t: number, done?: boolean) => {
    cb((end - start) * t + start, done);
  });
}

export function easeQuadBezier(entity: Entity,
                               start: number,
                               end: number,
                               p0: number,
                               duration: number,
                               cb: EaseAssign): void {
  easeBase(entity, duration, (t: number, done?: boolean) => {
    const a = Math.pow(1 - t, 2);
    const b = 2 * (1 - t) * t;
    const c = Math.pow(t, 2);

    cb(a * start + b * p0 + c * end, done);
  });
}

export function easeCubeBezier(entity: Entity,
                               start: number,
                               end: number,
                               p0: number,
                               p1: number,
                               duration: number,
                               cb: EaseAssign): void {
  easeBase(entity, duration, (t: number, done?: boolean) => {
    const a = Math.pow(1 - t, 3);
    const b = 3 * Math.pow(1 - t, 2) * t;
    const c = 3 * (1 - t) * Math.pow(t, 2);
    const d = Math.pow(t, 3);

    cb(a * start + b * p0 + c * p1 + d * end, done);
  });
}

export function easeBase(entity: Entity,
                         duration: number,
                         cb: EaseAssign): void {
  let t = 0;

  const f = function(event: IntervalEventData) {
    t += event.dt;

    if (t > duration) {
      cb(1, true);
      entity.off(f);
    } else {
      cb(t / duration);
    }
  };

  entity.on("interval", f);
}
