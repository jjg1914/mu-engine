import { Assets } from "../util/assets";

export interface TilesetData {
  assets: { load(asset: string): any };
  tileset: string;
  data: number[][];
}

export class TilesetComponent implements TilesetData {
  assets: { load(asset: string): any };
  tileset: string;
  data: number[][];

  constructor(options?: Partial<TilesetData>) {
    this.assets = new Assets();
    this.tileset = "";
    this.data = [];

    Object.assign(this, options);
  }
}
