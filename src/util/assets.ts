import { Path } from "./path";
import { Sprite } from "./sprite";
import { Stage } from "./stage";
import { Tileset } from "./tileset";

export type RawImage = HTMLImageElement | HTMLCanvasElement;
type Cacheable = Sprite | Tileset | RawImage;

export type AssetItem = { type: string, data: any };
export type AssetTable = { [ key: string ]: AssetItem | undefined };
export interface AssetConfig {
  preload?: boolean;
  assets: AssetTable;
}

export class Assets {
  private _config: AssetConfig;
  private _cache: { [ key: string ]: Cacheable | undefined };

  constructor(config: AssetConfig) {
    this._config = config;
    this._cache = {};

    if (this._config.preload !== undefined && this._config.preload) {
      this._preload();
    }
  }

  loadPath(asset: string): Path {
    const value = this.load(asset);

    if (!(value instanceof Path)) {
      throw new Error("not a path: " + asset);
    }

    return value;
  }

  loadStage(asset: string): Stage {
    const value = this.load(asset);

    if (!(value instanceof Stage)) {
      throw new Error("not a stage : " + asset);
    }

    return value;
  }

  loadSprite(asset: string): Sprite {
    const value = this.load(asset);

    if (!(value instanceof Sprite)) {
      throw new Error("not a sprite: " + asset);
    }

    return value;
  }

  loadTileset(asset: string): Tileset {
    const value = this.load(asset);

    if (!(value instanceof Tileset)) {
      throw new Error("not a tileset: " + asset);
    }

    return value;
  }

  loadRawimage(asset: string): RawImage {
    const value = this.load(asset);

    if (!(value instanceof HTMLImageElement) &&
        !(value instanceof HTMLCanvasElement)) {
      throw new Error("not a rawimage: " + asset);
    }

    return value;
  }


  load(asset: string): any {
    const data = this._config.assets[asset];

    if (data !== undefined) {
      switch (data.type) {
        case "path":
          return Path.unserialize(data.data);
        case "stage":
          return Stage.unserialize(data.data);
        case "rawimage":
          if (this._cache[asset] === undefined) {
            const image = new Image();
            image.src = data.data;

            this._cache[asset] = image;
          }

          return this._cache[asset];
        case "sprite":
          if (this._cache[asset] === undefined) {
            this._cache[asset] = Sprite.unserialize(data.data);
          }

          return this._cache[asset];
        case "tileset":
          if (this._cache[asset] === undefined) {
            this._cache[asset] = Tileset.unserialize(data.data);
          }

          return this._cache[asset];
        default:
          return data.data;
      }
    } else {
      throw new Error("no asset: " + asset);
    }
  }

  paths(): string[] {
    return this._filterType("path");
  }

  stages(): string[] {
    return this._filterType("stage");
  }

  sprites(): string[] {
    return this._filterType("sprite");
  }

  tilesets(): string[] {
    return this._filterType("tileset");
  }

  rawimages(): string[] {
    return this._filterType("rawimage");
  }

  private _filterType(type: string): string[] {
    const rval: string[] = [];

    for (let e in this._config.assets) {
      const asset = this._config.assets[e];

      if (asset !== undefined && asset.type === type) {
        rval.push(e);
      }
    }

    return rval;
  }

  private _preload(): void {
    for (let e in this._config.assets) {
      const value = this._config.assets[e];

      if (value !== undefined && this._cache[e] === undefined) {
        switch (value.type) {
          case "sprite":
            this._cache[e] = Sprite.unserialize(value.data);
            break;
          case "tileset":
            this._cache[e] = Tileset.unserialize(value.data);
            break;
          case "rawimage":
            const image = new Image();
            image.src = value.data;

            this._cache[e] = image;
            break;
        }
      }
    }
  }
}
