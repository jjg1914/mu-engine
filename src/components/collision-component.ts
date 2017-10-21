import { CollisionEntity } from "../util/collision";

export interface CollisionData {
  solid: boolean | [ number | null, number | null ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;
}

export class CollisionComponent implements CollisionData {
  solid: boolean | [ number | null, number | null ];
  ignoreSolid: boolean;
  landing?: CollisionEntity;

  constructor(...options: (Partial<CollisionData> | undefined)[]) {
    Object.assign(this, {
      solid: false,
      ignoreSolid: false,
    }, ...options);
  }
}
