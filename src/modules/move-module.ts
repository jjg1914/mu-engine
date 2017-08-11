import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
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

export function MoveModule(klass: Constructor<Entity>): Constructor<Entity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);
      const config: MoveConfig = args[0];

      this.on("interval", (ev: IntervalEventData) => {
        this.send("premove", new MoveEvent("premove", config.move.gravity,
                                                      config.move.bounds,
                                                      ev.dt));
        this.send("move", new MoveEvent("move", config.move.gravity,
                                                config.move.bounds,
                                                ev.dt));
        this.send("postmove", new MoveEvent("postmove", config.move.gravity,
                                                        config.move.bounds,
                                                        ev.dt));
      });
    }
  }
}
