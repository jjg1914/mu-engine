import {
  Behavior,
  BehaviorState,
  BehaviorOptions,
} from "./behavior";

export interface PhaseBehaviorConfig {
  period: number | (() => number);
  leading?: boolean;
}

export class PhaseBehavior implements Behavior {
  private _t: number;
  private _child: Behavior;
  private _config: PhaseBehaviorConfig;

  constructor(config: PhaseBehaviorConfig, child: Behavior) {
    this._t = 0;
    this._child = child;
    this._config = config;

    if (this._config.leading) {
      if (typeof this._config.period === "function") {
        this._t = this._config.period();
      } else {
        this._t = this._config.period;
      }
    }
  }

  reset(): void {
    if (typeof this._config.period === "function") {
      this._t = this._config.period();
    } else {
      this._t = this._config.period;
    }
  }

  call(options: BehaviorOptions): BehaviorState {
    if (this._t > 0) {
      this._t = Math.max(this._t - options.dt, 0);
    }

    if (this._t === 0) {
      return this._child.call(options);
    } else {
      return "pending";
    }
  }
}
