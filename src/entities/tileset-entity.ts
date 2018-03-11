import { Tileset } from "../util/tileset";

import {
  PositionData,
  PositionComponent,
} from "../components/position-component";

import {
  RenderData,
  RenderComponent,
} from "../components/render-component";

import {
  TilesetData,
  TilesetComponent,
} from "../components/tileset-component";

import { RenderSystem } from "../systems/render-system";

import {
  BaseEntity,
  BaseEntityConfig,
} from "./base-entity";

export interface TilesetEntityConfig extends BaseEntityConfig {
  tileset: Partial<TilesetData>;
  render: Partial<RenderData>;
  position: Partial<PositionData>;
}

export class TilesetEntity extends BaseEntity {
  tileset: TilesetData;
  render: RenderData;
  position: PositionData;

  constructor(config?: Partial<TilesetEntityConfig>) {
    super(config);
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d");

    if (layerCtx === null) {
      throw new Error("Failed to create 2d context");
    }

    this.position = new PositionComponent(config && config.position);

    this.tileset = new TilesetComponent(config && config.tileset);

    const tileset = this.tileset.assets.load(this.tileset.tileset) as Tileset;

    layer.width = this.position.width;
    layer.height = this.position.height;

    tileset.ready(() => {
      for (let j = 0; j < this.tileset.data.length; j += 1) {
        for (let i = 0; i < this.tileset.data[j].length; i += 1) {
          tileset.drawTile(layerCtx, this.tileset.data[j][i], i, j);
        }
      }
    });

    this.render = new RenderComponent(Object.assign({
      image: layer,
    }, config && config.render));

    RenderSystem(this);
  }
}
