import { CollisionEntity } from "../util/collision";

export interface CollisionData {
  solid: boolean | [ number, number ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;
}

export class CollisionComponent implements CollisionData {
  solid: boolean | [ number, number ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;

  constructor(options: Partial<CollisionData> = {}) {
    Object.assign(this, {
      solid: false,
      ignoreSolid: false,
    }, options);
  }
}
