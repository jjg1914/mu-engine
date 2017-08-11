import { Entity } from "../entities/entity";
import { MovementData } from "./movement-component"
import { Shape } from "../util/shape";
import { CollisionEntity } from "../util/collision";

export interface PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  solid: boolean;
  ignoreSolid: boolean;
  landing: CollisionEntity | null;
  mask?: Shape | null;
}

export class PositionComponent implements PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  solid: boolean;
  ignoreSolid: boolean;
  landing: (Entity & { movement: MovementData, position: PositionData }) | null;
  mask: Shape | null;

  constructor(options: Partial<PositionData> = {}) {
    Object.assign(this, {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotate: 0,
      solid: false,
      ignoreSolid: false,
      landing: null,
      mask: null,
    }, options);
  }
}
