import * as Immutable from "immutable";

function Interval(rate: number, callback: (any) => void): void {
  const start = performance.now()
  let now = start, last = start;
  const interval = setInterval(function() {
    try {
      last = now;
      now = performance.now();

      callback(new Interval.Event({ t: now - start, dt: now - last }));
    } catch (err) {
      clearInterval(interval);
      callback(err)
    }
  }, 1000 / rate);
};

module Interval {
  export class Event extends Immutable.Record({
    t: 0,
    dt: 0,
  }) {
    public t: number;
    public dt: number;
  }
}

export default Interval;
