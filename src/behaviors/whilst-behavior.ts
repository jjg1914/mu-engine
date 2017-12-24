import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export class WhilstBehavior implements Behavior {
  private _whilst: Behavior;
  private _loop: Behavior;

  constructor(whilst: Behavior, loop: Behavior) {
    this._whilst = whilst;
    this._loop = loop;
  }

  reset(): void {
    this._whilst.reset();
    this._loop.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    const tmp = this._whilst.call(options);

    if (tmp === "success") {
      return this._loop.call(options);
    } else {
      return tmp;
    }
  }
}
