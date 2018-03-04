import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
  EntityChildEvent,
} from "../events/entity-event";

export class CollectionEntity extends BaseEntity {
  private _collection: { [id: number ]: Entity };
  private _length: number;

  constructor() {
    super();
    this._collection = {};
    this._length = 0;

    this.last((event: string, data: any) => {
      for (let e in this._collection) {
        if (this._collection[e].send(event, data)) {
          return true;
        }
      }

      return false;
    });

    this.on("put", (ev: EntityAddEventData) => {
      this.put(ev.target);
    });

    this.on("remove", (ev: EntityDestroyEventData) => {
      this.remove(ev.target);
    });
  }

  size(): number {
    return this._length;
  }

  put(entity: Entity): this {
    if (entity.parent === undefined) {
      this._collection[entity.id] = entity;
      entity.parent = this;
      this._length += 1;

      entity.send("enter", new EntityChildEvent("enter"));
    }

    return this;
  }

  remove(entity: Entity): this {
    if (entity.parent === this) {
      entity.send("exit", new EntityChildEvent("exit"));

      delete entity.parent;
      delete this._collection[entity.id];
      this._length -= 1;
    }

    return this;
  }
}
