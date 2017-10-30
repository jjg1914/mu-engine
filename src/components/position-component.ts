import { Shape } from "../util/shape";

export interface PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  mask?: Shape;
}

export class PositionComponent implements PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  mask?: Shape;

  constructor(options?: Partial<PositionData>) {
    Object.assign(this, {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }, options);
  }
}
