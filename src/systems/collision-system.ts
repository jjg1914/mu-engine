import { Constructor } from "../util/mixin";
import { CollisionEntity } from "../util/collision";
import { CollisionEventData } from "../modules/collision-module";

export function CollisionSystem(klass: Constructor<CollisionEntity>)
: Constructor<CollisionEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      this.on("precollision", (ev: CollisionEventData) => {
        ev.data.add(this);
      });
    }
  };
}
