import "../poly.d.ts";

import Engine, { Entity } from "../engine/engine";
import { Event } from "../engine/render";

export default function RenderSystem(engine: Engine,
                                     event: Event): void {
  engine.runIterator([ "position", "render" ],
                     (memo: Engine, entity: Entity): Engine => {
    let shape = entity.getIn([ "render", "shape" ]);
    let x = entity.getIn([ "position", "x" ]);
    let y = entity.getIn([ "position", "y" ]);
    let width = entity.getIn([ "position", "width" ]);
    let height = entity.getIn([ "position", "height" ]);
    let rotate = entity.getIn([ "position", "rotate" ]);

    if (!(shape instanceof Path2D)) {
      shape = new Path2D();

      shape.moveTo(0, 0);
      shape.lineTo(width, 0);
      shape.lineTo(width, height);
      shape.lineTo(0, height);
      shape.lineTo(0, 0);
    }

    event.ctx.save();

    event.ctx.translate(x, y);

    if (rotate !== 0) {
      event.ctx.translate(width / 2, height / 2);
      event.ctx.rotate(rotate);
      event.ctx.translate(-width / 2, -height / 2);
    }

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
