import { Collision } from "../util/collision";

export type CollisionEventType = "precollision" |
                                 "postcollision" |
                                 "outofbounds";

export interface CollisionEventData {
  type: CollisionEventType;
  data: Collision;
}

export class CollisionEvent implements CollisionEventData {
  type: CollisionEventType;
  data: Collision;

  constructor(type: CollisionEventType, data: Collision) {
    this.type = type;
    this.data = data;
  }
}
