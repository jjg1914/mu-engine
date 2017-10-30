import { Transform } from "../util/matrix";
import { Shape } from "../util/shape";

export interface RenderData {
  stroke?: string;
  fill?: string;
  image?: HTMLImageElement | HTMLCanvasElement;
  sprite?: string;
  spriteFrame?: number;
  depth?: number;
  transform?: Transform;
  shape?: Shape;
  text?: string;
  children?: RenderData[];
}

export class RenderComponent implements RenderData {
  stroke?: string;
  fill?: string;
  image?: HTMLImageElement | HTMLCanvasElement;
  sprite?: string;
  spriteFrame?: number;
  depth?: number;
  transform?: Transform;
  shape?: Shape;
  text?: string;
  children?: RenderData[];

  constructor(options?: Partial<RenderData>) {
    Object.assign(this, options);
  }
}
