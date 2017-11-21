export type BehaviorState = "success" | "failure" | "pending";
export interface BehaviorOptions {
  t: number;
  dt: number;
}

export interface Behavior {
  reset(): void;
  call(options: BehaviorOptions): BehaviorState;
}
