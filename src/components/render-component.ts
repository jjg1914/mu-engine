export interface RenderData {
  stroke: string | null;
  fill: string | null;
}

export class RenderComponent implements RenderData {
  stroke: string | null;
  fill: string | null;

  constructor(options: Partial<RenderData> = {}) {
    Object.assign(this, {
      stroke: null,
      fill: "#000000",
    }, options);
  }
}
