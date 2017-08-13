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
    let rval = true;

    if (handlers != null) {
      let i = 0;
      const _f = () => {
        i += 1;

        if (i < handlers.length) {
          handlers[i].apply(this, args);
        } else {
          rval = false;
        }

        if (event !== "_last") {
          return this.send("_last", event, ...args);
        } else {
          return rval;
        }
      };
      args.unshift(_f);
      handlers[i].apply(this, args);

      return rval;
    } else if (event !== "_last") {
      return this.send("_last", event, ...args);
    } else {
      return false
    }
  }

  around(event: string, handler: Function): this {
    const handlers = this._handlers[event];

    if (handlers != null) {
      handlers.unshift(handler);
    } else {
      this._handlers[event] = [ handler ];
    }

    return this;
  }

  before(event: string, handler: Function): this {
    this.around(event, (f: Function, ...args: any[]) => {
      const rval = handler.apply(this, args);
      if (!rval) {
        f();
      }
    });
    return this;
  }

  after(event: string, handler: Function): this {
    this.around(event, (f: Function, ...args: any[]) => {
      const rval = f();
      if (!rval) {
        handler.apply(this, args);
      }
    });
    return this;
  }

  on(event: string, handler: Function): this {
    const handlers = this._handlers[event];
    const wrapper = (f: Function, ...args: any[]) => {
      const rval = handler.apply(this, args);
      if (!rval) {
        f();
      }
    };

    if (handlers != null) {
      handlers.push(wrapper);
    } else {
      this._handlers[event] = [ wrapper ];
    }

    return this;
  }

  last(handler: Function): this {
    return this.on("_last", handler);
  }
}
