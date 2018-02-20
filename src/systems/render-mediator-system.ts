import { Entity } from "../entities/entity";
import { CanvasBuffer, CanvasBufferConfig } from "../util/canvas-buffer";

export type RenderConfig = CanvasBufferConfig;

export function RenderMediatorSystem(entity: Entity,
                                     config: RenderConfig)
: void {
  const buffer = new CanvasBuffer(config);

  let timeout: number | undefined;

  window.addEventListener("resize", () => {
    if (timeout === undefined) {
      timeout = setTimeout(() => {
        timeout = undefined;
        buffer.resize();
      }, 10);
    }
  });

  buffer.resize();

  entity.after("interval", () => {
    const ev = buffer.emit();

    ev.type = "prerender";
    entity.send("prerender", ev);

    ev.type = "render";
    entity.send("render", ev);

    buffer.render(ev.viewport);

    ev.type = "postrender";
    entity.send("postrender", ev);

    buffer.flip();
  });
}
