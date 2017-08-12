import { CollisionEntity } from "../util/collision";
import { CollisionEventData } from "../events/collision-event";

export function CollisionSystem(entity: CollisionEntity): void {
  entity.on("precollision", (ev: CollisionEventData) => {
    ev.data.add(entity);
  });
}
