import { Entity } from "../entities/entity";
import { IntervalEventData } from "../events/interval-event";

export interface TimeoutController {
  cancel(): void;
}

export function timeout(entity: Entity,
                        f: Function,
                        delay: number)
: TimeoutController {
  let count = 0;

  const handler = function(ev: IntervalEventData) {
    count += ev.dt;

    if (count >= delay) {
      entity.off(handler);
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
