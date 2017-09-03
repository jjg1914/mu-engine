import { CollisionEntity } from "../util/collision";
import { CollisionEvent, CollisionEventData } from "../events/collision-event";

export function CollisionSystem(entity: CollisionEntity): void {
  let _outofbounds = false;

  entity.on("precollision", (ev: CollisionEventData) => {
    _outofbounds = !ev.data.add(entity);
  });

  entity.on("postcollision", (ev: CollisionEventData) => {
    if (_outofbounds) {
      entity.send("outofbounds", new CollisionEvent("outofbounds", ev.data));
    }
  });
}
