export default class RenderSystem {
  constructor(camera) {
    this._camera = camera;
  }

  render(event, engine) {
    let [ cameraX, cameraY ] = this._camera.position();

    event.ctx.fillStyle = "white";
    event.ctx.fillRect(0, 0, event.width, event.height);
   
    engine.run([ "position", "render" ], (e) => {
      if (this._camera.isInView(e)) {
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
    });
  }
}
