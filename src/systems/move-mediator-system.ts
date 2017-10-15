import { Entity } from "../entities/entity";
import { Bounds } from "../util/shape";
import { IntervalEventData } from "../events/interval-event";
import { MoveEvent } from "../events/move-event";

export interface MoveConfig {
  gravity: number;
  bounds: Bounds;
}

export function MoveMediatorSystem(entity: Entity, config: MoveConfig): void {
  entity.on("interval", (ev: IntervalEventData) => {
    entity.send("premove", new MoveEvent("premove", config.gravity,
                                                    config.bounds,
                                                    ev.dt));
    entity.send("move", new MoveEvent("move", config.gravity,
                                              config.bounds,
                                              ev.dt));
    entity.send("postmove", new MoveEvent("postmove", config.gravity,
                                                      config.bounds,
                                                      ev.dt));
  });
}
