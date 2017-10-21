import { RenderData } from "../../components/render-component";
import { RenderBackend, RenderBackendItem } from "../render-backend";
import { Bounds } from "../shape";
import { Assets } from "../assets";

export class RenderBackend2D implements RenderBackend {
  private _depths: number[];
  private _layers: { [ key: number ]: RenderBackendItem[] };
  private _ctx: CanvasRenderingContext2D;
  private _assets: Assets;

  constructor(ctx: CanvasRenderingContext2D, assets?: Assets) {
    this._depths = [ 0 ];
    this._layers = { 0: [] };
    this._ctx = ctx;
    this._assets = assets != null ? assets : new Assets({ assets: {} });
  }

  add(data: RenderBackendItem): void {
    const depth = data.render.depth != null ? data.render.depth : 0;

    if (this._layers.hasOwnProperty(depth.toString())) {
      this._layers[depth].push(data);
    } else {
      this._depths.push(depth);
      this._layers[depth] = [ data ];
    }
  }

  render(viewport: Bounds): void {
    this._depths.sort();
    (this._ctx as any).resetTransform();
    this._ctx.translate(-viewport.left, -viewport.top);

    for (let i = 0; i < this._depths.length; ++i) {
      const layer = this._layers[this._depths[i]];
      
      for (let j = 0; j < layer.length; ++j) {
        _render(this._ctx, layer[j].render, layer[j], this._assets);
      }

      layer.length = 0;
    }
  }

  assets(): Assets {
    return this._assets;
  }
}

function _render(ctx: CanvasRenderingContext2D,
                 data: RenderData,
                 root: RenderBackendItem,
                 assets: Assets): void {
  ctx.save();
  if (data.transform != null) {
    ctx.transform(data.transform[0],
                  data.transform[3],
                  data.transform[1],
                  data.transform[4],
                  data.transform[2],
                  data.transform[5]);
  }

  if (data.sprite != null) {
    const sprite = assets.loadSprite(data.sprite);
    sprite.drawFrame(ctx, data.spriteFrame != null ? data.spriteFrame : 0,
                     root.x, root.y);
  } else if (data.image != null) {
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

  if (data.children != null) {
    for (let i = 0; i < data.children.length; ++i) {
      _render(ctx, data.children[i], root, assets);
    }
  }

  ctx.restore();
}
