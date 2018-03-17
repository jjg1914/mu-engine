import { Stage } from "../util/stage";

import {
  StageData,
  StageComponent,
} from "../components/stage-component";

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

export interface StageConfig {
  stage?: Partial<StageData>;
  position?: Partial<PositionData>;
  render?: Partial<RenderData>;
}

export class StageEntity extends CollectionEntity {
  stage: StageData;
  position: PositionData;
  render: RenderData;

  constructor(config: StageConfig) {
    super();

    const width = config && config.position && config.position.width || 0;
    const height = config && config.position && config.position.height || 0;

    this.stage = new StageComponent(Object.assign({
      stage: new Stage(width, height),
    }, config && config.stage));

    this.position = new PositionComponent(Object.assign({
      width: this.stage.stage.bounds().right + 1,
      height: this.stage.stage.bounds().bottom + 1,
    }, config && config.position));

    this.render = new RenderComponent(config && config.render);

    for (let e of this.stage.stage.buildEntities(this.stage)) {
      this.put(e);
    }

    MoveMediatorSystem(this, {
      gravity: this.stage.gravity || 0,
      bounds: this.stage.stage.bounds(),
    });
    CollisionMediatorSystem(this, { bounds: this.stage.stage.bounds() });
    RenderSystem(this);
  }
}
