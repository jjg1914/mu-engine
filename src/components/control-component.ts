export interface ControlData {
  xAccel: number;
  yAccel: number;
  xSpeed: number;
  ySpeed: number;
  jumpSpeed: number;
  jumpCutoff: number;
}

export class ControlComponent implements ControlData {
  xAccel: number;
  yAccel: number;
  xSpeed: number;
  ySpeed: number;
  jumpSpeed: number;
  jumpCutoff: number;

  constructor(options?: Partial<ControlData>) {
    this.xAccel = 0;
    this.yAccel = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.jumpSpeed = 0;
    this.jumpCutoff = 0;

    Object.assign(this, options);
  }
}
