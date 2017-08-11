import { Path } from "./path";
import { Stage } from "./stage";

export interface AssetConfig {
  [ key: string ]: { type: string, data: any };
}

export class Assets {
  private _config: AssetConfig;

  constructor(config: AssetConfig) {
    this._config = config;
  }

  load(asset: string): any {
    const data = this._config[asset];

    switch (data.type) {
      case "path":
        return Path.unserialize(data.data);
      case "stage":
        return Stage.unserialize(data.data);
    }
  }
}
