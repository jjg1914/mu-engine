import { Path } from "../util/path";

export interface PathData {
  path?: Path;
  repeat: boolean;
  t?: number;
  x: number;
  y: number;
}

export class PathComponent implements PathData {
  path?: Path;
  repeat: boolean;
  t?: number;
  x: number;
  y: number;

  constructor(options?: Partial<PathData>) {
    Object.assign(this, {
      repeat: false,
      x: 0,
      y: 0,
    }, options);
  }
}
