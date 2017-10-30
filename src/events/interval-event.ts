export type IntervalEventType = "interval";

export interface IntervalEventData {
  type: IntervalEventType;
  t: number;
  dt: number;
}

export class IntervalEvent implements IntervalEventData {
  type: "interval";
  t: number;
  dt: number;

  constructor(t: number, dt: number) {
    this.type = "interval";
    this.t = t;
    this.dt = dt;
  }
}
