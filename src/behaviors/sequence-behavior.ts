import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export class SequenceBehavior implements Behavior {
  private _index: number;
  private _children: Behavior[];

  constructor(args: Behavior[]) {
    this._index = 0;
    this._children = [ ...args ];
  }

  reset(): void {
    this._index = 0;

    for (let i = 0; i < this._children.length; ++i) {
      this._children[i].reset();
    }
  }

  call(options: BehaviorOptions): BehaviorState {
    while (this._index < this._children.length) {
      switch (this._children[this._index].call(options)) {
        case "success":
          this._index += 1;
          break;
        case "failure":
          return "failure";
        case "pending":
          return "pending";
      }
    }

    return "success";
  }
}
