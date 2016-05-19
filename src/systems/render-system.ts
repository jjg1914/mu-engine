import Engine, { Entity } from "../engine/engine";
import { Event } from "../engine/render";

export default function RenderSystem(engine: Engine,
                                     event: Event): void {
  event.ctx.fillStyle = "#282828";
  event.ctx.fillRect(0, 0, event.width, event.height);

  engine.runIterator([ "position", "render" ],
                     (memo: Engine, entity: Entity): Engine => {
    event.ctx.strokeStyle = entity.getIn([ "render", "stroke" ]);
    event.ctx.fillStyle = entity.getIn([ "render", "fill" ]);

    event.ctx.fillRect(entity.getIn([ "position", "x" ]),
                       entity.getIn([ "position", "y" ]),
                       entity.getIn([ "position", "width" ]),
                       entity.getIn([ "position", "height" ]));

    return memo;
  });
}
