export interface BackgroundData {
  fixed: boolean;
  xPeriod: number;
  yPeriod: number;
  xAmp: number;
  yAmp: number;
}

export class BackgroundComponent implements BackgroundData {
  fixed: boolean;
  xPeriod: number;
  yPeriod: number;
  xAmp: number;
  yAmp: number;

  constructor(options?: Partial<BackgroundData>) {
    this.fixed = false;
    this.xPeriod = 0;
    this.yPeriod = 0;
    this.xAmp = 0;
    this.yAmp = 0;

    Object.assign(this, options);
  }
}
