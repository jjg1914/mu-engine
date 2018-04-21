import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export interface RepeatBehaviorConfig {
  count: number;
}

export class RepeatBehavior implements Behavior {
  private _pending: boolean;
  private _child: Behavior;
  private _count: number;
  private _countMax: number;

  constructor(arg: Behavior, config?: Partial<RepeatBehaviorConfig>) {
    this._pending = false;
    this._child = arg;
    this._count = config && config.count || 1;
    this._countMax = config && config.count || 1;
  }

  reset(): void {
    this._pending = false;
    this._count = this._countMax;

    this._child.reset();
  }

  call(options: BehaviorOptions): BehaviorState {
    if (!this._pending) {
      this._child.reset();
    }

    switch (this._child.call(options)) {
      case "success":
        this._pending = false;
        this._count -= 1;

        if (this._count === 0) {
          return "success";
        } else {
          this._pending = false;
          this._child.reset();
          return "pending";
        }
      case "failure":
        this._pending = false;
        this._count -= 1;

        if (this._count === 0) {
          return "failure";
        } else {
          this._pending = false;
          this._child.reset();
          return "pending";
        }
      case "pending":
        this._pending = true;
        return "pending";
    }
  }
}
