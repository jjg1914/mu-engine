export interface RenderData {
  stroke: string | null;
  fill: string | null;
  depth: number;
}

export class RenderComponent implements RenderData {
  stroke: string | null;
  fill: string | null;
  depth: number;

  constructor(options: Partial<RenderData> = {}) {
    Object.assign(this, {
      stroke: null,
      fill: "#000000",
      depth: 0,
    }, options);
  }
}
