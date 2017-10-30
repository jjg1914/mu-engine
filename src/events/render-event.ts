import { Bounds } from "../util/shape";
import { RenderBackend } from "../util/render-backend";

export type RenderEventType = "prerender" | "render" | "postrender";

export interface RenderEventData {
  type: RenderEventType;
  backend: RenderBackend;
  width: number;
  height: number;
  viewport: Bounds;
}

export class RenderEvent implements RenderEventData {
  type: RenderEventType;
  backend: RenderBackend;
  width: number;
  height: number;
  viewport: Bounds;

  constructor(backend: RenderBackend, width: number, height: number) {
    this.backend = backend;
    this.width = width;
    this.height = height;
    this.viewport = {
      left: 0,
      top: 0,
      right: width - 1,
      bottom: height - 1,
    };
  }
}
