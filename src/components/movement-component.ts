export interface MovementData {
  xSpeed: number;
  ySpeed: number;
  xMax?: number;
  yMax?: number;
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  restrict?: boolean | [ number | null, number | null ];
}

export class MovementComponent implements MovementData {
  xSpeed: number;
  ySpeed: number;
  xMax: number;
  yMax: number;
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  restrict?: boolean | [ number, number ];

  constructor(...options: (Partial<MovementData> | undefined)[]) {
    Object.assign(this, {
      xSpeed: 0,
      ySpeed: 0,
      xSubpixel: 0,
      ySubpixel: 0,
      xChange: 0,
      yChange: 0,
    }, ...options);
  }
}
