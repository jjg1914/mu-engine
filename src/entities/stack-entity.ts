import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

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
    this._stack.unshift(entity);
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
