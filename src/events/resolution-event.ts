import { CollisionEntity, Vector } from "../util/collision";

export type ResolutionEventType = "collision" | "bump";

export interface ResolutionEventData {
  type: ResolutionEventType;
  target: CollisionEntity;
  mtv: Vector;
}

export class ResolutionEvent implements ResolutionEventData {
  type: ResolutionEventType;
  target: CollisionEntity;
  mtv: Vector;

  constructor(type: ResolutionEventType, target: CollisionEntity, mtv: Vector) {
    this.type = type;
    this.target = target;
    this.mtv = mtv;
  }
}
