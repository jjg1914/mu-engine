export interface MovementData {
  xSpeed: number;
  ySpeed: number;
  xAccel: number;
  yAccel: number;
  xMax: number | null;
  yMax: number | null;
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  friction: number | null;
  nogravity: boolean;
  restrict: boolean;
}

export class MovementComponent implements MovementData {
  xSpeed: number;
  ySpeed: number;
  xAccel: number;
  yAccel: number;
  xMax: number | null;
  yMax: number | null;
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  friction: number | null;
  nogravity: boolean;
  restrict: boolean;

  constructor(options: Partial<MovementData> = {}) {
    Object.assign(this, {
      xSpeed: 0,
      ySpeed: 0,
      xAccel: 0,
      yAccel: 0,
      xMax: null,
      yMax: null,
      xSubpixel: 0,
      ySubpixel: 0,
      xChange: 0,
      yChange: 0,
      friction: null,
      restrict: false,
      nogravity: false,
    }, options);
  }
}
