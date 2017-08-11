import { Entity } from "./entity";
import { BaseEntity } from "./base-entity";

export class StackEntity extends BaseEntity {
  private _stack: Entity[];

  constructor() {
    super();
    this._stack = [];
  }

  push(entity: Entity): this {
    this._stack.push(entity);
    return this;
  }

  pop(): this {
    this._stack.pop();
    return this;
  }

  swap(entity: Entity): this {
    return this.pop().push(entity);
  }

  send(event: string, ...args: any[]): boolean {
    if (super.send(event, ...args)) {
      return true;
    } else {
      for (let i = this._stack.length - 1; i >= 0; ++i) {
        if (this._stack[i].send(event, ...args)) {
          return true;
        }
      }

      return false;
    }
  }
}
