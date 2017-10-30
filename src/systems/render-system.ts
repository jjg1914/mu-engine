import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { RenderData } from "../components/render-component";
import { RenderEventData } from "../events/render-event";
import { shapeFor } from "../modules/shape";

export interface RenderEntity extends Entity {
  position: PositionData;
  render: RenderData;
}

export function RenderSystem(entity: RenderEntity): void {
  entity.on("render", (event: RenderEventData) => {
    const data = {
      x: entity.position.x,
      y: entity.position.y,
      width: entity.position.width,
      height: entity.position.height,
      render: entity.render,
    };

    if (entity.position.mask !== undefined) {
      data.render.shape = shapeFor(entity);
    } else {
      data.render.shape = undefined;
    }

    event.backend.add(data);
  });
}
