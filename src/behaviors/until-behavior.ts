import {
  Behavior,
  BehaviorState,
  BehaviorOptions,
} from "./behavior";

export class UntilBehavior implements Behavior {
  private _until: Behavior;

  constructor(until: Behavior) {
    this._until = until;
  }

  reset(): void {
    this._until.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    const tmp = this._until.call(options);

    if (tmp === "success") {
      return tmp;
    } else {
      if (tmp === "failure") {
        this._until.reset();
      }

      return "pending";
    }
  }
}
