import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";

const Now = (() => {
  if (performance.now != null) {
    return () => performance.now();
  } else {
    return () => Date.now();
  }
})();

export interface IntervalEventData {
  type: "interval";
  t: number;
  dt: number;
}

export class IntervalEvent implements IntervalEventData {
  type: "interval";
  t: number;
  dt: number;
  
  constructor(t: number, dt: number) {
    this.type = "interval";
    this.t = t;
    this.dt = dt;
  }
}

export interface IntervalConfig {
  interval: {
    fps: number;
  };
}

export function IntervalModule(klass: Constructor<Entity>)
: Constructor<Entity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);
      const config: IntervalConfig = args[0];

      const start = Now();
      let last = start;

      const interval = setInterval(() => {
        const now = Now();

        try {
          this.send("interval", new IntervalEvent(now - start, now - last));
        } catch (e) {
          clearInterval(interval);
          console.error(e);
        }

        last = now;
      }, 1000 / config.interval.fps);
    }
  };
}
