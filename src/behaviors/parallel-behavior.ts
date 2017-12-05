import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export class ParallelBehavior implements Behavior {
  private _children: Behavior[];

  constructor(...args: Behavior[]) {
    this._children = [ ...args ];
  }

  reset(): void {
    for (let i = 0; i < this._children.length; ++i) {
      this._children[i].reset();
    }
  }

  call(options: BehaviorOptions): BehaviorState {
    let status = 2;

    for (let i = 0; i < this._children.length; ++i) {
      switch (this._children[i].call(options)) {
        case "success":
          status = Math.min(status, 2);
          break;
        case "failure":
          status = Math.min(status, 1);
          break;
        case "pending":
          status = Math.min(status, 0);
          break;
      }
    }

    if (status === 0) {
      return "pending";
    } else if (status === 1) {
      return "failure";
    } else {
      return "success";
    }
  }
}
