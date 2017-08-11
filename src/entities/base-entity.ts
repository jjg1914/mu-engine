import { Entity } from "./entity";

export class BaseEntity implements Entity {
  private static _idCounter: number = 0;

  private _handlers: { [event: string]: Function[] | null | undefined };

  id: number;

  constructor() {
    this.id = ++BaseEntity._idCounter;
    this._handlers = {};
  }

  send(event: string, ...args: any[]): boolean {
    const handlers = this._handlers[event];

    if (handlers != null) {
      for (let i = 0; i < handlers.length; ++i) {
        if (handlers[i].apply(this, args)) {
          return true;
        }
      }

      return false;
    } else {
      return false
    }
  }

  on(event: string, handler: Function): this {
    const handlers = this._handlers[event];

    if (handlers != null) {
      handlers.unshift(handler);
    } else {
      this._handlers[event] = [ handler ];
    }

    return this;
  }
}
