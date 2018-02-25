import { Entity } from "../entities/entity";
import { IntervalEventData } from "../events/interval-event";
import { BehaviorData } from "../components/behavior-component";
import { Store } from "../util/store";

export interface BehaviorEntity extends Entity {
  behavior: BehaviorData;
}

export function BehaviorSystem(entity: BehaviorEntity): void {
  const store = new Store();

  entity.on("interval", (ev: IntervalEventData) => {
    if (entity.behavior.behavior !== undefined) {
      entity.behavior.behavior.call({
        t: ev.t,
        dt: ev.dt,
        store: store,
      });
    }
  });
}
