import { Entity } from "../entities/entity";
import { timeout, TimeoutController } from "../modules/timeout";

export type TimelineCallback = () => void;

export type TimelineArrayEntry = [ number, TimelineCallback ];
export type TimelineArray = TimelineArrayEntry[];

export interface TimelineObject {
  [key: number]: TimelineCallback;
}

export class Timeline {
  private _timeouts: TimeoutController[];

  constructor(entity: Entity, source: TimelineArray | TimelineObject) {
    this._timeouts = [];

    if (source instanceof Array) {
      let t = 0;

      for (let i = 0; i < source.length; ++i) {
        t += source[i][0];
        this._timeouts.push(timeout(entity, source[i][1], t));
      }
    } else {
      for (let e in source) {
        if (source.hasOwnProperty(e)) {
          this._timeouts.push(timeout(entity, source[e], Number(e)));
        }
      }
    }
  }

  cancel() {
    for (let i = 0; i < this._timeouts.length; ++i) {
      this._timeouts[i].cancel();
    }
  }
}
