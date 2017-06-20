import Path from "./path";
import Stage from "./stage";

export default class Assets {
  constructor(config) {
    this._config = config;
  }

  load(asset) {
    const data = this._config[asset];

    switch (data.type) {
      case "path":
        return Path.unserialize(data.data);
      case "stage":
        return Stage.unserialize(data.data);
    }
  }
}
