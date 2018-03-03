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
    this.repeat = false;
    this.x = 0;
    this.y = 0;

    Object.assign(this, options);
  }
}
