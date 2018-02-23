import { Entity } from "../entities/entity";
import { IntervalEventData } from "../events/interval-event";
import { BehaviorData } from "../components/behavior-component";

export interface BehaviorEntity extends Entity {
  behavior: BehaviorData;
}

export function BehaviorSystem(entity: BehaviorEntity): void {
  entity.on("interval", (ev: IntervalEventData) => {
    if (entity.behavior.behavior !== undefined) {
      entity.behavior.behavior.call(ev);
    }
  });
}
