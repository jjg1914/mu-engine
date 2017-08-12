import { Entity } from "../entities/entity";
import { Bounds } from "../util/shape";

export interface RenderEventData {
  type: "prerender" | "render" | "postrender";
  ctx: CanvasRenderingContext2D;
  width: number;  
  height: number;
  viewport: Bounds;
}

export class RenderEvent implements RenderEventData {
  type: "prerender" | "render" | "postrender";
  ctx: CanvasRenderingContext2D;
  width: number;  
  height: number;
  viewport: Bounds;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.viewport = {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1,
    }
  }
}

export interface BufferCanvasConfig {
  canvas: HTMLCanvasElement;
  width?: number;  
  height?: number;
  scale?: number;
  smoothing?: boolean;
  background?: string;
}

export interface RenderConfig {
  render: BufferCanvasConfig;
}

export function RenderModule(entity: Entity, config: RenderConfig): void {
  const buffer = new BufferCanvas(config.render);

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

  entity.on("interval", () => {
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

class BufferCanvas {
  private _config: BufferCanvasConfig;

  private _canvas: HTMLCanvasElement;
  private _buffer: HTMLCanvasElement;
  private _canvasCTX: CanvasRenderingContext2D;
  private _bufferCTX: CanvasRenderingContext2D;

  private _width: number;
  private _height: number;

  constructor(config: BufferCanvasConfig) {
    if (typeof config.canvas.getContext !== "function") {
      throw new Error("Canvas not supported");
    }

    this._config = config;

    this._canvas = this._config.canvas;
    this._buffer = document.createElement("canvas");

    const canvasCtx = this._canvas.getContext("2d"); 

    if (canvasCtx == null) {
      throw new Error("Failed to create 2d context");
    } else {
      this._canvasCTX = canvasCtx
    }

    const bufferCtx = this._buffer.getContext("2d"); 

    if (bufferCtx == null) {
      throw new Error("Failed to create 2d context");
    } else {
      this._bufferCTX = bufferCtx
    }
  }

  emit(): RenderEventData {
    return new RenderEvent(this._bufferCTX, this._width, this._height);
  }

  flip(): void {
    this._canvasCTX.drawImage(this._buffer, 0, 0);
  }

  resize(): void {
    const scale = (this._config.scale != null ? this._config.scale : 1);

    if (this._config.height != null) {
      this._height = this._config.height;
      this._canvas.style.height = (this._height * scale) + "px";
      this._canvas.height = this._height * scale;
    } else {
      const height = window.getComputedStyle(this._canvas).height;

      if (height == null) {
        throw new Error("Failed to get canvas height");
      } else {
        this._height = Math.floor(parseInt(height, 10) / scale);
      }
    }

    this._buffer.height = this._height;

    if (this._config.width != null) {
      this._width = this._config.width
    } else {
      this._width = Math.floor((3 / 4) * this._height);
    }

    this._canvas.style.width = (this._width * scale) + "px";
    this._canvas.width = this._width * scale;
    this._buffer.width = this._width;

    if (this._config.smoothing != null) {
      this._canvasCTX.mozImageSmoothingEnabled = this._config.smoothing;
      this._canvasCTX.webkitImageSmoothingEnabled = this._config.smoothing;
      this._canvasCTX.imageSmoothingEnabled = this._config.smoothing;
      this._bufferCTX.mozImageSmoothingEnabled = this._config.smoothing;
      this._bufferCTX.webkitImageSmoothingEnabled = this._config.smoothing;
      this._bufferCTX.imageSmoothingEnabled = this._config.smoothing;
    }

    if (this._config.scale != null) {
      this._canvasCTX.scale(this._config.scale, this._config.scale);
    }
  }
}
