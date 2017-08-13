import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

export class CollectionEntity extends BaseEntity {
  private _collection: { [id: number ]: Entity | null | undefined };

  constructor() {
    super();
    this._collection = {};

    this.last((event: string, ...args: any[]) => {
      for (let e in this._collection) {
        const entity = this._collection[e];

        if (this._collection.hasOwnProperty(e) && entity != null) {
          if (entity.send(event, ...args)) {
            return true;
          }
        }
      }

      return;
    });
  }

  put(entity: Entity): this {
    this._collection[entity.id] = entity;
    return this;
  }

  remove(entity: Entity): this {
    delete this._collection[entity.id];
    return this;
  }
}
