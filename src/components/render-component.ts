import { Transform } from "../util/matrix";
import { Shape, Dimensions } from "../util/shape";

export interface RenderData {
  visible?: boolean;
  wraparound?: boolean;
  stroke?: string;
  fill?: string;
  image?: HTMLImageElement | HTMLCanvasElement | string;
  sprite?: string;
  spriteFrame?: number;
  depth?: number;
  transform?: Transform;
  shape?: Shape | Dimensions | Path2D;
  text?: string;
  font?: string;
  children?: RenderData[];
}

export class RenderComponent implements RenderData {
  visible?: boolean;
  wraparound?: boolean;
  stroke?: string;
  fill?: string;
  image?: HTMLImageElement | HTMLCanvasElement | string;
  sprite?: string;
  spriteFrame?: number;
  depth?: number;
  transform?: Transform;
  shape?: Shape | Dimensions;
  text?: string;
  font?: string;
  children?: RenderData[];

  constructor(options?: Partial<RenderData>) {
    Object.assign(this, options);
  }
}
