import { RenderData } from "../../components/render-component";
import { RenderBackend, RenderBackendItem } from "../render-backend";
import { Bounds } from "../shape";

export class RenderBackend2D implements RenderBackend {
  private _depths: number[];
  private _layers: { [ key: number ]: RenderBackendItem[] };
  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._depths = [ 0 ];
    this._layers = { 0: [] };
    this._ctx = ctx;
  }

  add(data: RenderBackendItem): void {
    if (this._layers.hasOwnProperty(data.render.depth.toString())) {
      this._layers[data.render.depth].push(data);
    } else {
      this._depths.push(data.render.depth);
      this._layers[data.render.depth] = [ data ];
    }
  }

  render(viewport: Bounds): void {
    this._depths.sort();
    (this._ctx as any).resetTransform();
    this._ctx.translate(-viewport.left, -viewport.top);

    for (let i = 0; i < this._depths.length; ++i) {
      const layer = this._layers[this._depths[i]];
      
      for (let j = 0; j < layer.length; ++j) {
        _render(this._ctx, layer[j].render, layer[j]);
      }

      layer.length = 0;
    }
  }
}

function _render(ctx: CanvasRenderingContext2D,
                 data: RenderData,
                 root: RenderBackendItem): void {
  ctx.save();
  ctx.transform(data.transform[0],
                data.transform[3],
                data.transform[1],
                data.transform[4],
                data.transform[2],
                data.transform[5]);

    ctx.drawImage(data.image, 0, 0, data.image.width, data.image.height,
                              root.x, root.y, data.image.width, data.image.height);
  } else if (data.shape != null) {
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
      ctx.strokeText(data.text, root.x, root.y);
    }

    if (data.fill != null) {
      ctx.fillStyle = data.fill;
      ctx.fillText(data.text, root.x, root.y);
    }
  } else {
    if (data.stroke != null) {
      ctx.strokeStyle = data.stroke;
      ctx.strokeRect(root.x, root.y, root.width, root.height);
    }

    if (data.fill != null) {
      ctx.fillStyle = data.fill;
      ctx.fillRect(root.x, root.y, root.width, root.height);
    }
  }

  for (let i = 0; i < data.children.length; ++i) {
    _render(ctx, data.children[i], root, assets);
  }

  ctx.restore();
}
