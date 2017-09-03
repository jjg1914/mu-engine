import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
} from "../events/entity-event";

export class StackEntity extends BaseEntity {
  private _stack: Entity[];

  constructor() {
    super();
    this._stack = [];

    this.last((event: string, ...args: any[]) => {
      for (let i = 0; i < this._stack.length; ++i) {
        if (this._stack[i].send(event, ...args)) {
          return true;
        }
      }

      return;
    });
  }

  push(entity: Entity): this {
    const i = this._stack.length;

    this._stack.unshift(entity);

    entity.on("pop", (_ev: EntityDestroyEventData) => {
      if (this._stack[i] === entity) {
        while (this._stack.length > i) {
          this.pop();
        }
      }
    });

    entity.on("push", (ev: EntityAddEventData) => {
      if (this._stack[i] === entity) {
        this.push(ev.target);
      }
    });

    entity.on("swap", (ev: EntityAddEventData) => {
      if (this._stack[i] === entity) {
        this.swap(ev.target);
      }
    });

    return this;
  }

  pop(): this {
    this._stack.shift();
    return this;
  }

  swap(entity: Entity): this {
    return this.pop().push(entity);
  }
}
