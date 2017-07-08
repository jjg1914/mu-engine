import { shapeFor } from "../util/shape";

export default class RenderSystem {
  constructor(camera, config = {}) {
    this._camera = camera;
    this._maskMode = (config.maskMode != null ? config.maskMode : false);
  }

  render(event, engine) {
    let [ cameraX, cameraY ] = this._camera.position();

    event.ctx.fillStyle = "white";
    event.ctx.fillRect(0, 0, event.width, event.height);
   
    engine.run([ "position", "render" ], (e) => {
      if (this._camera.isInView(e)) {
        if (this._maskMode) {
          const shape = shapeFor(e);
          shape.translate(-cameraX, -cameraY);
          const path = shape.path();
          event.ctx.strokeStyle = "#00FFAA";
          event.ctx.stroke(path);
          return;
        }

        if (e.position.mask != null) {
          const shape = shapeFor(e);
          shape.translate(-cameraX, -cameraY);
          const path = shape.path();

          if (e.render.stroke != null) {
            event.ctx.strokeStyle = e.render.stroke;
            event.ctx.stroke(path);
          }

          if (e.render.fill != null) {
            event.ctx.fillStyle = e.render.fill;
            event.ctx.fill(path);
          }
        } else {
          if (e.render.stroke != null) {
            event.ctx.strokeStyle = e.render.stroke;
            event.ctx.strokeRect(e.position.x - cameraX,
                                 e.position.y - cameraY,
                                 e.position.width,
                                 e.position.height);
          }

          if (e.render.fill != null) {
            event.ctx.fillStyle = e.render.fill;
            event.ctx.fillRect(e.position.x - cameraX,
                               e.position.y - cameraY,
                               e.position.width,
                               e.position.height);
          }
        }
      }
    });
  }
}
