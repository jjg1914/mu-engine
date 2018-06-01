import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
  EntityChildEvent,
} from "../events/entity-event";

interface Node {
  entity: Entity;
  next?: number;
  prev?: number;
}

export class CollectionEntity extends BaseEntity {
  private _collection: { [id: number ]: Node };
  private _length: number;
  private _head?: number;
  private _tail?: number;

  constructor() {
    super();
    this._collection = {};
    this._length = 0;

    this.last((event: string, data: any) => {
      let i = this._head;

      while (i !== undefined) {
        const e = this._collection[i].entity;
        i = this._collection[i].next;

        if (e.send(event, data)) {
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
      const node = { entity: entity } as Node;

      this._collection[entity.id] = node;
      entity.parent = this;

      if (this._head === undefined) {
        this._head = entity.id;
      } else {
        node.prev = this._tail;
      }

      if (this._tail !== undefined) {
        this._collection[this._tail].next = entity.id;
      }

      this._tail = entity.id;

      this._length += 1;

      entity.send("enter", new EntityChildEvent("enter"));
    }

    return this;
  }

  remove(entity: Entity): this {
    if (entity.parent === this) {
      entity.send("exit", new EntityChildEvent("exit"));

      const node = this._collection[entity.id];

      if (node.prev !== undefined) {
        if (node.next !== undefined) {
          this._collection[node.prev].next = node.next;
        } else {
          delete this._collection[node.prev].next;
        }
      } else if (node.next !== undefined) {
        this._head = node.next;
      }

      if (node.next !== undefined) {
        if (node.prev !== undefined) {
          this._collection[node.prev].prev = node.prev;
        } else {
          delete this._collection[node.next].prev;
        }
      } else if (node.prev !== undefined) {
        this._tail = node.prev;
      }

      delete entity.parent;
      delete this._collection[entity.id];
      this._length -= 1;
    }

    return this;
  }
}
