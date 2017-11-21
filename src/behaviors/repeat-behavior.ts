import { Behavior, BehaviorState, BehaviorOptions  } from "./behavior";

export class RepeatBehavior implements Behavior {
  private _pending: boolean;
  private _child: Behavior;

  constructor(arg: Behavior) {
    this._pending = false;
    this._child = arg;
  }

  reset(): void {
    this._pending = false;

    this._child.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    if (!this._pending) {
      this._child.reset();
    }

    switch (this._child.call(options)) {
      case "success":
        this._pending = false;
        return "success";
      case "failure":
        this._pending = false;
        return "failure";
      case "pending":
        this._pending = true;
        return "pending";
    }
  }
}
