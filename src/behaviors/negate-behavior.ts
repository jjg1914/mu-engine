import {
  Behavior,
  BehaviorState,
  BehaviorOptions,
} from "./behavior";

export class NegateBehavior implements Behavior {
  private _negate: Behavior;

  constructor(negate: Behavior) {
    this._negate = negate;
  }

  reset(): void {
    this._negate.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    const tmp = this._negate.call(options);

    if (tmp === "success") {
      return "failure";
    } else if (tmp === "failure") {
      return "success";
    } else {
      return "pending";
    }
  }
}
