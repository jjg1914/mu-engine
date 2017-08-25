import { RenderEntity, RenderBackend } from "../render-backend";
import { shapeFor, Bounds } from "../shape";

export class RenderBackend2D implements RenderBackend {
  private _depths: number[];
  private _layers: { [ key: number ]: RenderEntity[] };
  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._depths = [ 0 ];
    this._layers = { 0: [] };
    this._ctx = ctx;
  }

  add(entity: RenderEntity): void {
    if (this._layers.hasOwnProperty(entity.render.depth.toString())) {
      this._layers[entity.render.depth].push(entity);
    } else {
      this._depths.push(entity.render.depth);
      this._layers[entity.render.depth] = [ entity ];
    }
  }

  render(viewport: Bounds): void {
    this._depths.sort();

    for (let i = 0; i < this._depths.length; ++i) {
      const layer = this._layers[this._depths[i]];
      
      for (let j = 0; j < layer.length; ++j) {
        const entity = layer[j];

        if (entity.position.mask != null) {
          const shape = shapeFor(entity);
          shape.translate(-viewport.left, -viewport.top);
          const path = shape.path();

          if (entity.render.stroke != null) {
            this._ctx.strokeStyle = entity.render.stroke;
            this._ctx.stroke(path);
          }

          if (entity.render.fill != null) {
            this._ctx.fillStyle = entity.render.fill;
            this._ctx.fill(path as any); // TODO
          }
        } else {
          if (entity.render.stroke != null) {
            this._ctx.strokeStyle = entity.render.stroke;
            this._ctx.strokeRect(entity.position.x - viewport.left,
                                 entity.position.y - viewport.top,
                                 entity.position.width,
                                 entity.position.height);
          }

          if (entity.render.fill != null) {
            this._ctx.fillStyle = entity.render.fill;
            this._ctx.fillRect(entity.position.x - viewport.left,
                               entity.position.y - viewport.top,
                               entity.position.width,
                               entity.position.height);
          }
        }
      }

      layer.length = 0;
    }
  }
}
