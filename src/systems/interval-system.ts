import { Entity } from "../entities/entity";
import { IntervalEvent } from "../events/interval-event";

const Now = (() => {
  try {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof performance.now !== "function") {
      return () => performance.now();
    } else {
      return () => Date.now();
    }
  } catch (e) {
    return () => Date.now();
  }
})();

export interface IntervalConfig {
  fps: number;
}

export function IntervalSystem(entity: Entity, config: IntervalConfig): void {
  const dt = 1000 / config.fps;
  const start = Now();
  let last = start;

  const interval = setInterval(() => {
    const now = Now();

    try {
      entity.send("interval", new IntervalEvent(now - start,
                                                Math.min(now - last, dt)));
    } catch (e) {
      clearInterval(interval);
      console.error(e);
    }

    last = now;
  }, dt);
}
