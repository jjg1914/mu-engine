import { RenderEventData, RenderEvent } from "../events/render-event";
import { RenderBackend } from "./render-backend";
import { RenderBackend2D } from "./render-backends/render-backend-2d";

export interface CanvasBufferConfig {
  canvas: HTMLCanvasElement;
  width?: number;  
  height?: number;
  scale?: number;
  smoothing?: boolean;
  background?: string;
}

export class CanvasBuffer {
  private _config: CanvasBufferConfig;

  private _canvas: HTMLCanvasElement;
  private _buffer: HTMLCanvasElement;
  private _canvasCTX: CanvasRenderingContext2D;
  private _backend: RenderBackend;

  private _width: number;
  private _height: number;

  constructor(config: CanvasBufferConfig) {
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

    const backendCtx2D = this._buffer.getContext("2d"); 

    if (backendCtx2D == null) {
      throw new Error("Failed to create 2d context");
    } else {
      this._backend = new RenderBackend2D(backendCtx2D);
    }
  }

  emit(): RenderEventData {
    return new RenderEvent(this._backend, this._width, this._height);
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
    }

    if (this._config.scale != null) {
      this._canvasCTX.scale(this._config.scale, this._config.scale);
    }
  }
}
