import { Entity } from "../entities/entity";
import { Bounds } from "../util/shape";
import { IntervalEventData } from "../events/interval-event";
import { MoveEvent } from "../events/move-event";

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
