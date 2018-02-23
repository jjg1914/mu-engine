import { Entity } from "../entities/entity";
import { IntervalEventData } from "../events/interval-event";

export interface IntervalController {
  cancel(): void;
}

export function interval(entity: Entity,
                         f: Function,
                         delay: number)
: IntervalController {
  let count = 0;

  const handler = function(ev: IntervalEventData) {
    count += ev.dt;

    if (count >= delay) {
      count = count - delay;
      f();
    }
  };

  entity.on("interval", handler);

  return {
    cancel: function() {
      entity.off(handler);
    },
  };
}
