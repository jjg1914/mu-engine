import { Entity } from "../entities/entity";
import { CanvasBuffer, CanvasBufferConfig } from "../util/canvas-buffer";

export interface RenderConfig {
  render: CanvasBufferConfig;
}

export function RenderModule(entity: Entity, config: RenderConfig): void {
  const buffer = new CanvasBuffer(config.render);

  let timeout: number | undefined;

  window.addEventListener("resize", () => {
    if (timeout == undefined) {
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

    if (config.render.background != null) {
      ev.ctx.fillStyle = config.render.background;
      ev.ctx.fillRect(0, 0, ev.viewport.right - ev.viewport.left + 1,
                            ev.viewport.bottom - ev.viewport.top + 1);
    }

    ev.type = "render";
    entity.send("render", ev);

    ev.type = "postrender";
    entity.send("postrender", ev);

    buffer.flip();
  });
}
