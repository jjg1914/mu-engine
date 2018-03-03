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
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    Object.assign(this, options);
  }
}
