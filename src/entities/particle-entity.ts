import {
  ParticleData,
  ParticleComponent,
} from "../components/particle-component";

import {
  PositionData,
  PositionComponent,
} from "../components/position-component";

import { ParticleSystem } from "../systems/particle-system";

import {
  BaseEntity,
  BaseEntityConfig,
} from "./base-entity";

export interface ParticleEntityConfig extends BaseEntityConfig {
  particle: Partial<ParticleData>;
  position: Partial<PositionData>;
}

export class ParticleEntity extends BaseEntity {
  particle: ParticleData;
  position: PositionData;

  constructor(config?: Partial<ParticleEntityConfig>) {
    super(config);

    this.particle = new ParticleComponent(config && config.particle);

    this.position = new PositionComponent(config && config.position);

    ParticleSystem(this);
  }
}
