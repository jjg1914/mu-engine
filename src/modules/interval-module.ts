import { Entity } from "../entities/entity";
import { IntervalEvent } from "../events/interval-event";

const Now = (() => {
  if (performance.now != null) {
    return () => performance.now();
  } else {
    return () => Date.now();
  }
})();

export interface IntervalConfig {
  interval: {
    fps: number;
  };
}

export function IntervalModule(entity: Entity, config: IntervalConfig): void {
  const dt = 1000 / config.interval.fps;
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
