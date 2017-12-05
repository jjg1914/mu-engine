import {
  Behavior,
  BehaviorState,
  BehaviorOptions,
} from "./behavior";

export interface PhaseBehaviorConfig {
  period: number;
}

export class PhaseBehavior implements Behavior {
  private _t: number;
  private _child: Behavior;
  private _config: PhaseBehaviorConfig;

  constructor(config: PhaseBehaviorConfig, child: Behavior) {
    this._t = 0;
    this._child = child;
    this._config = config;
  }

  reset(): void {
    // this._t = this._config.period;
  }

  call(options: BehaviorOptions): BehaviorState {
    if (this._t > 0) {
      this._t = Math.max(this._t - options.dt, 0);
    }

    if (this._t === 0) {
      const status = this._child.call(options);

      if (status === "success") {
        this._t = this._config.period;
      }

      return status;
    } else {
      return "pending";
    }
  }
}
