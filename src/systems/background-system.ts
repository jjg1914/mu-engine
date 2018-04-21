import { Entity } from "../entities/entity";

import { IntervalEventData } from "../events/interval-event";
import { RenderEventData } from "../events/render-event";

import { PositionData } from "../components/position-component";

import { BackgroundData } from "../components/background-component";

export interface BackgroundSystemEntity extends Entity {
  position: PositionData;
  background: BackgroundData;
}

export function BackgroundSystem(entity: BackgroundSystemEntity): void {
  let xT = 0;
  let yT = 0;

  entity.on("interval", (event: IntervalEventData) => {
    xT += event.dt;
    yT += event.dt;

    if (xT >= entity.background.xPeriod) {
      xT -= entity.background.xPeriod;
    }

    if (yT >= entity.background.yPeriod) {
      yT -= entity.background.yPeriod;
    }
  });

  entity.around("render", (f: Function, event: RenderEventData) => {
    if (entity.background.fixed) {
      entity.position.x = event.viewport.left;
      entity.position.y = event.viewport.top;

      entity.position.x +=
        (xT / entity.background.xPeriod) * entity.background.xAmp;
      entity.position.y +=
        (yT / entity.background.yPeriod) * entity.background.yAmp;

      return f();
    } else {
      const xSave = entity.position.x;
      const ySave = entity.position.y;

      try {
        entity.position.x =
          xSave + (xT / entity.background.xPeriod) * entity.background.xAmp;
        entity.position.y =
          ySave + (yT / entity.background.yPeriod) * entity.background.yAmp;

        return f();
      } finally {
        entity.position.x = xSave;
        entity.position.y = ySave;
      }
    }
  });
}
