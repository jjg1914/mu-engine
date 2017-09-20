import { Transform, identity } from "../util/matrix";
import { Shape } from "../util/shape";

export interface RenderData {
  stroke: string | null;
  fill: string | null;
  depth: number;
  transform: Transform;
  shape?: Shape | null;
  text?: string | null;
  children: RenderData[];
}

export class RenderComponent implements RenderData {
  stroke: string | null;
  fill: string | null;
  depth: number;
  transform: Transform;
  shape?: Shape | null;
  text?: string | null;
  children: RenderData[];

  constructor(options: Partial<RenderData> = {}) {
    Object.assign(this, {
      fill: "#000000",
      depth: 0,
      transform: ((t) => { identity(t); return t} )(new Array(6) as Transform),
      children: [],
    }, options);
  }
}
