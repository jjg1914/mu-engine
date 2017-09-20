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
  }

  push(entity: Entity, config: Partial<Config> = {}): this {
    this._stack.unshift([ entity, config ]);

    entity.on("pop", (_ev: EntityDestroyEventData) => {
      if (this._stack[0][0] === entity) {
        this.pop();
      }
    });

    entity.on("push", (ev: EntityAddEventData) => {
      if (this._stack[0][0] === entity) {
        this.push(ev.target, ev.config);
      }
    });

    entity.on("swap", (ev: EntityAddEventData) => {
      if (this._stack[0][0] === entity) {
        this.swap(ev.target, ev.config);
      }
    });

    return this;
  }

  pop(): this {
    this._stack.shift();
    return this;
  }

  swap(entity: Entity, config: Partial<Config> = {}): this {
    return this.pop().push(entity, config);
  }
}
