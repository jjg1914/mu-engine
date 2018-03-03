import { CollisionEntity } from "../util/collision";

export interface CollisionData {
  solid: boolean | [ number , number ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;
}

export class CollisionComponent implements CollisionData {
  solid: boolean | [ number , number ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;

  constructor(options?: Partial<CollisionData>) {
    this.solid = false;
    this.ignoreSolid = false;

    Object.assign(this, options);
  }
}
