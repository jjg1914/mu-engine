import { RenderData } from "../components/render-component";
import { RenderEventData } from "../events/render-event";
import { shapeFor, PositionEntity } from "../util/shape";

export interface RenderEntity extends PositionEntity {
  render: RenderData;
}

export function RenderSystem(entity: RenderEntity): void {
  entity.on("render", (event: RenderEventData) => {
    if (entity.position.mask != null) {
      const shape = shapeFor(entity);
      shape.translate(-event.viewport.left, -event.viewport.top);
      const path = shape.path();

      if (entity.render.stroke != null) {
        event.ctx.strokeStyle = entity.render.stroke;
        event.ctx.stroke(path);
      }

      if (entity.render.fill != null) {
        event.ctx.fillStyle = entity.render.fill;
        event.ctx.fill(path as any); // TODO
      }
    } else {
      if (entity.render.stroke != null) {
        event.ctx.strokeStyle = entity.render.stroke;
        event.ctx.strokeRect(entity.position.x - event.viewport.left,
                             entity.position.y - event.viewport.top,
                             entity.position.width,
                             entity.position.height);
      }

      if (entity.render.fill != null) {
        event.ctx.fillStyle = entity.render.fill;
        event.ctx.fillRect(entity.position.x - event.viewport.left,
                           entity.position.y - event.viewport.top,
                           entity.position.width,
                           entity.position.height);
      }
    }
  });
}
