import {
  ParticleData,
  ParticleComponent,
} from "../components/particle-component";

import {
  PositionData,
  PositionComponent,
} from "../components/position-component";

import {
  RenderData,
  RenderComponent,
} from "../components/render-component";

import { ParticleSystem } from "../systems/particle-system";

import {
  BaseEntity,
  BaseEntityConfig,
} from "./base-entity";

export interface ParticleEntityConfig extends BaseEntityConfig {
  particle: Partial<ParticleData>;
  position: Partial<PositionData>;
  render: Partial<RenderData>;
}

export class ParticleEntity extends BaseEntity {
  particle: ParticleData;
  position: PositionData;
  render: RenderData;

  constructor(config?: Partial<ParticleEntityConfig>) {
    super(config);

    this.particle = new ParticleComponent(config && config.particle);

    this.position = new PositionComponent(config && config.position);

    this.render = new RenderComponent(config && config.render);

    ParticleSystem(this);
  }
}
