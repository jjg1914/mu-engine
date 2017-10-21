import {
 PositionData,
 PositionComponent,
} from "../components/position-component";

import {
  AccelData,
  AccelComponent,
} from "../components/accel-component";

import {
  MovementData,
  MovementComponent,
} from "../components/movement-component";

import {
  CollisionData,
  CollisionComponent,
} from "../components/collision-component";

import {
  RenderData,
  RenderComponent,
} from "../components/render-component";

import { CollisionSystem } from "../systems/collision-system";
import { RenderSystem } from "../systems/render-system";

import { BaseEntity } from "./base-entity";

export interface SimpleEntityConfig {
  position: Partial<PositionData>;
  movement: Partial<MovementData>;
  collision: Partial<CollisionData>;
  accel: Partial<AccelData>;
  render: Partial<RenderData>;
}

export class SimpleEntity extends BaseEntity {
  position: PositionData;
  render: RenderData;
  movement: MovementData;
  collision: CollisionData;
  accel: AccelData;

  constructor(defaults: Partial<SimpleEntityConfig>,
              config: Partial<SimpleEntityConfig>) {
    super();

    this.position = new PositionComponent(defaults.position, config.position);
    this.accel = new AccelComponent(defaults.accel, config.accel);
    this.movement = new MovementComponent(defaults.movement, config.movement);
    this.collision = new CollisionComponent(defaults.collision, config.collision);
    this.render = new RenderComponent(defaults.render, config.render);

    CollisionSystem(this);
    RenderSystem(this);
  }
}
