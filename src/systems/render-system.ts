import { RenderData } from "../components/render-component";
import { RenderEventData } from "../modules/render-module";
import { Constructor } from "../util/mixin";
import { shapeFor, PositionEntity } from "../util/shape";

export interface RenderEntity extends PositionEntity {
  render: RenderData;
}

export function RenderSystem(klass: Constructor<RenderEntity>)
: Constructor<RenderEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      this.on("render", (event: RenderEventData) => {
        if (this.position.mask != null) {
          const shape = shapeFor(this);
          shape.translate(-event.viewport.left, -event.viewport.top);
          const path = shape.path();

          if (this.render.stroke != null) {
            event.ctx.strokeStyle = this.render.stroke;
            event.ctx.stroke(path);
          }

          if (this.render.fill != null) {
            event.ctx.fillStyle = this.render.fill;
            event.ctx.fill(path as any); // TODO
          }
        } else {
          if (this.render.stroke != null) {
            event.ctx.strokeStyle = this.render.stroke;
            event.ctx.strokeRect(this.position.x - event.viewport.left,
                                 this.position.y - event.viewport.top,
                                 this.position.width,
                                 this.position.height);
          }

          if (this.render.fill != null) {
            event.ctx.fillStyle = this.render.fill;
            event.ctx.fillRect(this.position.x - event.viewport.left,
                               this.position.y - event.viewport.top,
                               this.position.width,
                               this.position.height);
          }
        }
      });
    }
  };
}
