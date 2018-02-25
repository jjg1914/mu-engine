import { Store } from "../util/store";

export type BehaviorState = "success" | "failure" | "pending";

export interface BehaviorOptions {
  t: number;
  dt: number;
  store: Store;
}

export interface Behavior {
  reset(): void;
  call(options: BehaviorOptions): BehaviorState;
}
