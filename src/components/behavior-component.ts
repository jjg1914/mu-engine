import { Behavior } from "../behaviors/behavior";

export interface BehaviorData {
  behavior?: Behavior;
}

export class BehaviorComponent implements BehaviorData {
  behavior?: Behavior;

  constructor(config?: Partial<BehaviorData>) {
    Object.assign(this, config);
  }
}
