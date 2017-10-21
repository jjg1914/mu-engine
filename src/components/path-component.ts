import { Path } from "../util/path";

export interface PathData {
  path: Path | null;
  repeat: boolean;
  t: number | null;
  x: number;
  y: number;
}

export class PathComponent implements PathData {
  path: Path | null;
  repeat: boolean;
  t: number | null;
  x: number;
  y: number;

  constructor(options?: Partial<PathData>) {
    Object.assign(this, {
      path: null,
      repeat: false,
      t: null,
      x: 0,
      y: 0,
    }, options);
  }
}
