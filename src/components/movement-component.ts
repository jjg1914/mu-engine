export interface MovementData {
  xSpeed: number;
  ySpeed: number;
  xMax?: number | [ number , number ];
  yMax?: number | [ number , number ];
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  restrict?: boolean | [ number , number ];
}

export class MovementComponent implements MovementData {
  xSpeed: number;
  ySpeed: number;
  xMax?: number | [ number , number ];
  yMax?: number | [ number , number ];
  xSubpixel: number;
  ySubpixel: number;
  xChange: number;
  yChange: number;
  restrict?: boolean | [ number, number ];

  constructor(options?: Partial<MovementData>) {
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.xSubpixel = 0;
    this.ySubpixel = 0;
    this.xChange = 0;
    this.yChange = 0;

    Object.assign(this, options);
  }
}
