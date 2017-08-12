import { Bounds } from "../util/shape";

export type RenderEventType = "prerender" | "render" | "postrender";

export interface RenderEventData {
  type: RenderEventType;
  ctx: CanvasRenderingContext2D;
  width: number;  
  height: number;
  viewport: Bounds;
}

export class RenderEvent implements RenderEventData {
  type: RenderEventType;
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
