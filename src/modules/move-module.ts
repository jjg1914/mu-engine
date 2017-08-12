import { Entity } from "../entities/entity";
import { Bounds } from "../util/shape";
import { IntervalEventData } from "./interval-module";

export interface MoveEventData {
  type: "move" | "premove" | "postmove";
  gravity: number;
  bounds: Bounds;
  dt: number;
}

export class MoveEvent implements MoveEventData {
  type: "move" | "premove" | "postmove";
  gravity: number;
  bounds: Bounds;
  dt: number;

  constructor(type: "move" | "premove" | "postmove",
              gravity: number,
              bounds: Bounds,
              dt: number) {
    this.type = type;
    this.gravity = gravity;
    this.bounds = bounds;
    this.dt = dt;
  }
}

export interface MoveConfig {
  move: {
    gravity: number;
    bounds: Bounds;
  }
}

export function MoveModule(entity: Entity, config: MoveConfig): void {
  entity.on("interval", (ev: IntervalEventData) => {
    entity.send("premove", new MoveEvent("premove", config.move.gravity,
                                                    config.move.bounds,
                                                    ev.dt));
    entity.send("move", new MoveEvent("move", config.move.gravity,
                                              config.move.bounds,
                                              ev.dt));
    entity.send("postmove", new MoveEvent("postmove", config.move.gravity,
                                                      config.move.bounds,
                                                      ev.dt));
  });
}
