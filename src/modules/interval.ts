import * as Immutable from "immutable";
import { Callback } from "../runtime";

export default function Interval<T>(rate: number, cb: Callback<T>): void {
  const start: number = performance.now();
  let now: number = start;
  let last: number = start;
  const interval = setInterval((): void => {
    try {
      last = now;
      now = performance.now();

      cb(new Event({ t: now - start, dt: now - last }));
    } catch (err) {
      clearInterval(interval);
      cb(err);
    }
  }, 1000 / rate);
};

// tslint:disable-next-line:variable-name
export const EventBase = Immutable.Record({
  t: 0,
  dt: 0,
});

export class Event extends EventBase {
  public t: number;
  public dt: number;
}
