import { Path } from "./path";
import { Sprite } from "./sprite";
import { Stage } from "./stage";
import { Tileset } from "./tileset";

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
      case "sprite":
        return Sprite.unserialize(data.data);
      case "stage":
        return Stage.unserialize(data.data);
      case "tileset":
        return Tileset.unserialize(data.data);
    }
  }

  paths(): string[] {
    const rval: string[] = [];

    for (let e in this._config) {
      if (this._config.hasOwnProperty(e) && this._config[e].type === "path") {
        rval.push(e);
      }
    }

    return rval;
  }

  stages(): string[] {
    const rval: string[] = [];

    for (let e in this._config) {
      if (this._config.hasOwnProperty(e) && this._config[e].type === "stage") {
        rval.push(e);
      }
    }

    return rval;
  }
}
