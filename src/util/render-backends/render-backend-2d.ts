import { RenderData } from "../../components/render-component";
import { RenderBackend, RenderBackendItem } from "../render-backend";
import { Bounds, Dimensions, Circle, Polygon } from "../shape";
import { Assets } from "../assets";

export class RenderBackend2D implements RenderBackend {
  private _depths: number[];
  private _layers: { [ key: number ]: RenderBackendItem[] | undefined };
  private _ctx: CanvasRenderingContext2D;
  private _assets: Assets;

  constructor(ctx: CanvasRenderingContext2D, assets?: Assets) {
    this._depths = [ 0 ];
    this._layers = { 0: [] };
    this._ctx = ctx;
    this._assets = assets !== undefined ? assets : new Assets({ assets: {} });
  }

  add(data: RenderBackendItem): void {
    const depth = data.render.depth !== undefined ? data.render.depth : 0;
    const layer = this._layers[depth];

    if (layer !== undefined) {
      layer.push(data);
    } else {
      this._depths.push(depth);
      this._layers[depth] = [ data ];
    }
  }

  render(viewport: Bounds, buffer: HTMLCanvasElement): void {
    this._depths.sort();
    (this._ctx as any).resetTransform();
    this._ctx.translate(-viewport.left, -viewport.top);

    for (let i = 0; i < this._depths.length; ++i) {
      const layer = this._layers[this._depths[i]];

      if (layer !== undefined) {
        for (let j = 0; j < layer.length; ++j) {
          _render(this._ctx, buffer, layer[j].render, layer[j], this._assets);
        }

        layer.length = 0;
      }
    }
  }

  assets(): Assets {
    return this._assets;
  }
}

function _render(ctx: CanvasRenderingContext2D,
                 buffer: HTMLCanvasElement,
                 data: RenderData,
                 root: RenderBackendItem,
                 assets: Assets): void {
  if (data.visible !== undefined && !data.visible) {
    return;
  }

  ctx.save();
  if (data.transform !== undefined) {
    ctx.transform(data.transform[0],
                  data.transform[3],
                  data.transform[1],
                  data.transform[4],
                  data.transform[2],
                  data.transform[5]);
  }

  if (data.sprite !== undefined) {
    const sprite = assets.loadSprite(data.sprite);
    sprite.drawFrame(ctx, data.spriteFrame !== undefined ? data.spriteFrame : 0,
                     root.x, root.y);
  } else if (data.image !== undefined) {
    const image = (typeof data.image === "string") ?
                  assets.loadRawimage(data.image) : data.image;

    ctx.drawImage(image, 0, 0,
                  image.width, image.height,
                  root.x, root.y,
                  image.width, image.height);

    if (data.wraparound) {
      if (root.y + image.height >= buffer.height) {
        ctx.drawImage(image, 0, 0,
                      image.width, image.height,
                      root.x, root.y - image.height,
                      image.width, image.height);

        if (root.x + image.width >= buffer.width) {
          ctx.drawImage(image, 0, 0,
                        image.width, image.height,
                        root.x - image.width, root.y - image.height,
                        image.width, image.height);
        } else if (root.x < 0) {
          ctx.drawImage(image, 0, 0,
                        image.width, image.height,
                        root.x + image.width, root.y - image.height,
                        image.width, image.height);
        }
      } else if (root.y < 0) {
        ctx.drawImage(image, 0, 0,
                      image.width, image.height,
                      root.x, root.y + image.height,
                      image.width, image.height);

        if (root.x + image.width >= buffer.width) {
          ctx.drawImage(image, 0, 0,
                        image.width, image.height,
                        root.x - image.width, root.y + image.height,
                        image.width, image.height);
        } else if (root.x < 0) {
          ctx.drawImage(image, 0, 0,
                        image.width, image.height,
                        root.x + image.width, root.y + image.height,
                        image.width, image.height);
        }
      }

      if (root.x + image.width >= buffer.width) {
        ctx.drawImage(image, 0, 0,
                      image.width, image.height,
                      root.x - image.width, root.y,
                      image.width, image.height);
      } else if (root.x < 0) {
        ctx.drawImage(image, 0, 0,
                      image.width, image.height,
                      root.x + image.width, root.y,
                      image.width, image.height);
      }
    }
  } else if (data.shape !== undefined) {
    if ((data.shape instanceof Polygon) ||
        (data.shape instanceof Circle)) {
      const path = data.shape.path();

      if (data.stroke !== undefined) {
        ctx.strokeStyle = data.stroke;
        ctx.stroke(path);
      }

      if (data.fill !== undefined) {
        ctx.fillStyle = data.fill;
        ctx.fill(path as any); // TODO
      }
    } else {
      const shape = data.shape as Dimensions;

      if (data.stroke !== undefined) {
        ctx.strokeStyle = data.stroke;
        ctx.strokeRect(root.x, root.y, shape.width, shape.height);
      }

      if (data.fill !== undefined) {
        ctx.fillStyle = data.fill;
        ctx.fillRect(root.x, root.y, shape.width, shape.height);
      }
    }
  } else if (data.text !== undefined) {
    const fontset = _parseFontset(data.font);

    if (fontset !== undefined) {
      ctx.save();
      try {
        const tileset = assets.loadTileset(fontset);
        ctx.translate(root.x, root.y);

        for (let i = 0; i < data.text.length; ++i) {
          const c = data.text.charCodeAt(i) + 1;
          tileset.drawTile(ctx, c, i, 0);
        }
      } finally {
        ctx.restore();
      }
    } else {
      if (data.font !== undefined) {
        ctx.font = data.font;
      } else {
        ctx.font = "8pt monospace";
      }
 
      if (data.stroke !== undefined) {
        ctx.strokeStyle = data.stroke;
        ctx.strokeText(data.text, root.x, root.y);
      }

      if (data.fill !== undefined) {
        ctx.fillStyle = data.fill;
        ctx.fillText(data.text, root.x, root.y);
      }
    }
  } else {
    if (data.stroke !== undefined) {
      ctx.strokeStyle = data.stroke;
      ctx.strokeRect(root.x, root.y, root.width, root.height);
    }

    if (data.fill !== undefined) {
      ctx.fillStyle = data.fill;
      ctx.fillRect(root.x, root.y, root.width, root.height);
    }
  }

  if (data.children !== undefined) {
    for (let i = 0; i < data.children.length; ++i) {
      _render(ctx, buffer, data.children[i], root, assets);
    }
  }

  ctx.restore();
}

function _parseFontset(s?: string): string | void {
  if (s !== undefined) {
    const i = s.indexOf("!");

    if (i >= 0 && s.substr(0, i) === "tileset") {
      return s.substr(i + 1);
    }
  }
}
