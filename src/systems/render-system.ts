import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { RenderData } from "../components/render-component";
import { RenderEventData } from "../events/render-event";
import { shapeFor, PositionEntity } from "../util/shape";

export interface RenderEntity extends Entity {
  position?: PositionData;
  render: RenderData;
}

export function RenderSystem(entity: RenderEntity): void {
  entity.on("render", (event: RenderEventData) => {
    const data = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      render: entity.render,
    };

    if (entity.position != null) {
      data.x = entity.position.x;
      data.y = entity.position.y;
      data.width = entity.position.width;
      data.height = entity.position.height;

      if (entity.position.mask != null) {
        data.render.shape = shapeFor(entity as PositionEntity);
      } else {
        data.render.shape = null;
      }
    }

    event.backend.add(data);
  });
}
