import { RenderData } from "../../components/render-component";
import { RenderBackend } from "../render-backend";
import { Bounds } from "../shape";

export class RenderBackend2D implements RenderBackend {
  private _depths: number[];
  private _layers: { [ key: number ]: RenderData[] };
  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._depths = [ 0 ];
    this._layers = { 0: [] };
    this._ctx = ctx;
  }

  add(data: RenderData): void {
    if (this._layers.hasOwnProperty(data.depth.toString())) {
      this._layers[data.depth].push(data);
    } else {
      this._depths.push(data.depth);
      this._layers[data.depth] = [ data ];
    }
  }

  render(viewport: Bounds): void {
    this._depths.sort();
    (this._ctx as any).resetTransform();
    this._ctx.translate(-viewport.left, -viewport.top);

    for (let i = 0; i < this._depths.length; ++i) {
      const layer = this._layers[this._depths[i]];
      
      for (let j = 0; j < layer.length; ++j) {
        _render(this._ctx, layer[j]);
      }

      layer.length = 0;
    }
  }
}

function _render(ctx: CanvasRenderingContext2D, data: RenderData): void {
  ctx.save();
  ctx.transform(data.transform[0],
                data.transform[3],
                data.transform[1],
                data.transform[4],
                data.transform[2],
                data.transform[5]);

  if (data.shape != null) {
    const path = data.shape.path();

    if (data.stroke != null) {
      ctx.strokeStyle = data.stroke;
      ctx.stroke(path);
    }

    if (data.fill != null) {
      ctx.fillStyle = data.fill;
      ctx.fill(path as any); // TODO
    }
  } else if (data.text != null) {
    ctx.font = "8pt monospace";

    if (data.stroke != null) {
      ctx.strokeStyle = data.stroke;
      ctx.strokeText(data.text, 0, 0);
    }

    if (data.fill != null) {
      ctx.fillStyle = data.fill;
      ctx.fillText(data.text, 0, 0);
    }
  } else {
    if (data.stroke != null) {
      ctx.strokeStyle = data.stroke;
      ctx.strokeRect(0, 0, 1, 1);
    }

    if (data.fill != null) {
      ctx.fillStyle = data.fill;
      ctx.fillRect(0, 0, 1, 1);
    }
  }

  for (let i = 0; i < data.children.length; ++i) {
    _render(ctx, data.children[i]);
  }

  ctx.restore();
}
