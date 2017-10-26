import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
  Config,
} from "../events/entity-event";

export class StackEntity extends BaseEntity {
  private _stack: ([ Entity, Partial<Config> ])[];

  constructor() {
    super();
    this._stack = [];

    this.last((event: string, ...args: any[]) => {
      for (let i = 0; i < this._stack.length; ++i) {
        if (this._stack[i][0].send(event, ...args)) {
          return true;
        } else if (this._stack[i][1].block != null && this._stack[i][1].block) {
          break;
        }
      }

      return;
    });

    this.on("pop", (_ev: EntityDestroyEventData) => {
      this.pop();
    });

    this.on("push", (ev: EntityAddEventData) => {
      this.push(ev.target, ev.config);
    });

    this.on("swap", (ev: EntityAddEventData) => {
      this.swap(ev.target, ev.config);
    });
  }

  push(entity: Entity, config: Partial<Config> = {}): this {
    if (entity.parent === undefined) {
      this._stack.unshift([ entity, config ]);
      entity.parent = this;
    }

    return this;
  }

  pop(): this {
    const e = this._stack.shift();
    if (e !== undefined) {
      delete e[0].parent;
    }

    return this;
  }

  swap(entity: Entity, config: Partial<Config> = {}): this {
    return this.pop().push(entity, config);
  }
}
