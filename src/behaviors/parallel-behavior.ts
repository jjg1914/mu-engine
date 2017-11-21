import { Behavior, BehaviorState, BehaviorOptions  } from "./behavior";

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
    for (let i = 0; i < this._children.length; ++i) {
      switch (this._children[i].call(options)) {
        case "success":
          return "success";
        case "failure":
          return "failure";
        case "pending":
          break;
      }
    }

    return "pending";
  }
}
