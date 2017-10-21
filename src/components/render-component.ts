import { Transform } from "../util/matrix";
import { Shape } from "../util/shape";

export interface RenderData {
  stroke?: string | null;
  fill?: string | null;
  image?: HTMLImageElement | HTMLCanvasElement | null;
  sprite?: string | null;
  spriteFrame?: number | null;
  depth?: number;
  transform?: Transform;
  shape?: Shape | null;
  text?: string | null;
  children?: RenderData[];
}

export class RenderComponent implements RenderData {
  stroke?: string | null;
  fill?: string | null;
  image?: HTMLImageElement | null;
  sprite?: string | null;
  spriteFrame?: number | null;
  depth?: number;
  transform?: Transform;
  shape?: Shape | null;
  text?: string | null;
  children?: RenderData[];

  constructor(...options: (Partial<RenderData> | undefined)[]) {
    Object.assign(this, ...options);
  }
}
