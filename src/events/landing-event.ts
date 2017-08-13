import { CollisionEntity } from "../util/collision";

export type LandingEventType = "landing";

export interface LandingEventData {
  type: LandingEventType;
  target: CollisionEntity;
}

export class LandingEvent implements LandingEventData {
  type: LandingEventType;
  target: CollisionEntity;

  constructor(target: CollisionEntity) {
    this.type = "landing";
    this.target = target;
  }
}
