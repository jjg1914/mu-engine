export interface AccelData {
  xAccel: number;
  yAccel: number;
  friction?: number;
  drag?: number;
  nogravity: boolean;
  nofriction: boolean;
}

export class AccelComponent implements AccelData {
  xAccel: number;
  yAccel: number;
  friction?: number;
  drag?: number;
  nogravity: boolean;
  nofriction: boolean;

  constructor(options: Partial<AccelData> = {}) {
    Object.assign(this, {
      xAccel: 0,
      yAccel: 0,
      nogravity: false,
      nofriction: false,
    }, options);
  }
}
