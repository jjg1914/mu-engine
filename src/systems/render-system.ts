import "../poly.d.ts";

import Engine, { Entity } from "../engine/engine";
import { Event } from "../engine/render";

export default function RenderSystem(engine: Engine,
                                     event: Event): void {
  engine.runIterator([ "position", "render" ],
                     (memo: Engine, entity: Entity): Engine => {
    let shape = entity.getIn([ "render", "shape" ]);

    if (!(shape instanceof Path2D)) {
      shape = new Path2D();

      shape.moveTo(0, 0);
      shape.lineTo(entity.getIn(["position", "width"]), 0);
      shape.lineTo(entity.getIn(["position", "width"]),
                   entity.getIn(["position", "height"]));
      shape.lineTo(0, entity.getIn(["position", "height"]));
      shape.lineTo(0, 0);
    }

    event.ctx.save();
    event.ctx.translate(entity.getIn(["position", "x"]),
                      entity.getIn(["position", "y"]));

    event.ctx.lineWidth = entity.getIn(["render", "strokeWidth"]);

    let strokeStyle = entity.getIn([ "render", "stroke" ]);

    if (typeof strokeStyle === "string") {
      event.ctx.strokeStyle = strokeStyle;
      event.ctx.stroke(shape);
    }

    let fillStyle = entity.getIn([ "render", "fill" ]);

    if (typeof fillStyle === "string") {
      event.ctx.fillStyle = fillStyle;
      event.ctx.fill(shape);
    }

    event.ctx.restore();

    return memo;
  });
}
