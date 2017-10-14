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
  drag: number | null;
  nogravity: boolean;
  nofriction: boolean;
  restrict: boolean | [ number, number ];
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
  nofriction: boolean;
  drag: number | null;
  nogravity: boolean;
  restrict: boolean | [ number, number ];

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
      drag: null,
      restrict: false,
      nogravity: false,
      nofriction: false,
    }, options);
  }
}
