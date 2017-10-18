import { Shape } from "../util/shape";

export interface PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  mask?: Shape | null;
}

export class PositionComponent implements PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  mask: Shape | null;

  constructor(options: Partial<PositionData> = {}) {
    Object.assign(this, {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotate: 0,
      mask: null,
    }, options);
  }
}
