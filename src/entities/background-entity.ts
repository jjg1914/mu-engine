import {
  BaseEntity,
  BaseEntityConfig,
} from "./base-entity";

import {
  PositionData,
  PositionComponent,
} from "../components/position-component";

import {
  RenderData,
  RenderComponent,
} from "../components/render-component";

import {
  BackgroundData,
  BackgroundComponent,
} from "../components/background-component";

import { BackgroundSystem } from "../systems/background-system";
import { RenderSystem } from "../systems/render-system";

export interface BackgroundEntityConfig extends BaseEntityConfig {
  position: Partial<PositionData>;
  render: Partial<RenderData>;
  background: Partial<BackgroundData>;
}

export class BackgroundEntity extends BaseEntity {
  position: PositionData;
  render: RenderData;
  background: BackgroundData;

  constructor(config?: Partial<BackgroundEntityConfig>) {
    super(config);

    this.position = new PositionComponent(config && config.position);

    this.render = new RenderComponent(config && config.render);

    this.background = new BackgroundComponent(config && config.background);

    BackgroundSystem(this);
    RenderSystem(this);
  }
}
