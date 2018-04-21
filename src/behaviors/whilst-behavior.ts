import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export class WhilstBehavior implements Behavior {
  private _whilst: Behavior;

  constructor(whilst: Behavior) {
    this._whilst = whilst;
  }

  reset(): void {
    this._whilst.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    const tmp = this._whilst.call(options);

    if (tmp === "failure") {
      return "success";
    } else {
      if (tmp === "success") {
        this._whilst.reset();
      }

      return "pending";
    }
  }
}
