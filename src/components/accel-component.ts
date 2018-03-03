export interface AccelData {
  xAccel: number;
  yAccel: number;
  friction?: number;
  drag?: number;
  nogravity: boolean;
  nofriction: boolean;
  restrict: boolean;
}

export class AccelComponent implements AccelData {
  xAccel: number;
  yAccel: number;
  friction?: number;
  drag?: number;
  nogravity: boolean;
  nofriction: boolean;
  restrict: boolean;

  constructor(options?: Partial<AccelData>) {
    this.xAccel = 0;
    this.yAccel = 0;
    this.nogravity = false;
    this.nofriction = false;
    this.restrict = true;

    Object.assign(this, options);
  }
}
