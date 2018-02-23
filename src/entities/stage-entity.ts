import { Assets } from "../util/assets";
import { Stage } from "../util/stage";
import { RenderEventData } from "../events/render-event";

import {
  PositionData,
  PositionComponent,
} from "../components/position-component";

import {
  RenderData,
  RenderComponent,
} from "../components/render-component";

import { CollectionEntity } from "./collection-entity";

import { MoveMediatorSystem } from "../systems/move-mediator-system";
import { CollisionMediatorSystem } from "../systems/collision-mediator-system";
import { RenderSystem } from "../systems/render-system";
import { RenderBackendItem } from "../util/render-backend";

export interface StageConfig {
  assets: Assets;
  stage: string | Stage;
  gravity?: number;
}

export class StageEntity extends CollectionEntity {
  position: PositionData;
  render: RenderData;

  protected stage: Stage;
  protected layers: RenderBackendItem[];

  constructor(config: StageConfig) {
    super();

    if (typeof config.stage === "string") {
      this.stage = config.assets.load(config.stage);
    } else {
      this.stage = config.stage;
    }

    this.position = new PositionComponent({
      width: this.stage.bounds().right + 1,
      height: this.stage.bounds().bottom + 1,
    });

    this.render = new RenderComponent();

    for (let e of this.stage.buildEntities(config)) {
      this.put(e);
    }

    MoveMediatorSystem(this, {
      gravity: config.gravity || 0,
      bounds: this.stage.bounds(),
    });
    CollisionMediatorSystem(this, { bounds: this.stage.bounds() });
    RenderSystem(this);

    this.layers = this.stage.buildLayers(config).map((e) => {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        render: e,
      };
    });

    this.on("render", (event: RenderEventData) => {
      for (let e of this.layers) {
        event.backend.add(e);
      }
    });
  }
}
