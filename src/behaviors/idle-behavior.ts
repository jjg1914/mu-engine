import { Behavior, BehaviorState, BehaviorOptions } from "./behavior";

export class IdleBehavior implements Behavior {
  reset(): void {
    // nothing to reset
  }

  call(_options: BehaviorOptions): BehaviorState {
    return "success";
  }
}
