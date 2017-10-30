import { Bounds } from "../util/shape";

export type MoveEventType = "move" | "premove" | "postmove";

export interface MoveEventData {
  type: MoveEventType;
  gravity: number;
  bounds: Bounds;
  dt: number;
}

export class MoveEvent implements MoveEventData {
  type: MoveEventType;
  gravity: number;
  bounds: Bounds;
  dt: number;

  constructor(type: MoveEventType,
              gravity: number,
              bounds: Bounds,
              dt: number) {
    this.type = type;
    this.gravity = gravity;
    this.bounds = bounds;
    this.dt = dt;
  }
}
