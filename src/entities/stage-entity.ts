import { Assets } from "../util/assets";
import { Stage, EntityDefinition } from "../util/stage";
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

import { MoveModule } from "../modules/move-module";
import { CollisionModule } from "../modules/collision-module";
import { RenderSystem } from "../systems/render-system";

export interface StageConfig {
  assets: Assets;
  stage: string;
  entities: { [ key: string ]: EntityDefinition };
}

export class StageEntity extends CollectionEntity {
  position: PositionData;
  render: RenderData;

  protected stage: Stage;

  constructor(config: StageConfig) {
    super();

    this.stage = config.assets.load(config.stage);

    this.position = new PositionComponent({
      width: this.stage.bounds().right + 1,
      height: this.stage.bounds().bottom + 1,
    });

    this.render = new RenderComponent({
      fill: "#FFFFFF",
    });

    for (let e of this.stage.buildEntities(config)) {
      this.put(e);
    }

    MoveModule(this, { move: { gravity: 480, bounds: this.stage.bounds() } });
    CollisionModule(this, { collision: { bounds: this.stage.bounds() } });
    RenderSystem(this);

    const layers = this.stage.buildLayers(config);

    this.on("render", (event: RenderEventData) => {
      for (let e of layers) {
        event.backend.add({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          render: e,
        });
      }
    });
  };
}
