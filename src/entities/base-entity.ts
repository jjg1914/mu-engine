import { Entity } from "./entity";

export class BaseEntity implements Entity {
  private static _idCounter: number = 0;

  id: number;
  parent?: Entity;

  private _handlers: { [event: string]: Function[] | undefined };
  private _active: boolean;

  constructor() {
    this.id = ++BaseEntity._idCounter;
    this._handlers = {};
    this._active = true;
  }

  send(event: string, data: any): boolean {
    return this._implsend(event, event, data);
  }

  around(event: string, handler: Function): this {
    const handlers = this._handlers[event];

    if (handlers !== undefined) {
      handlers.unshift(handler);
    } else {
      this._handlers[event] = [ handler ];
    }

    return this;
  }

  before(event: string, handler: Function): this {
    this.around(event, (f: Function, data: any)=> {
      const rval = handler.call(this, data);
      if (!rval) {
        f();
      }
    });
    return this;
  }

  after(event: string, handler: Function): this {
    this.around(event, (f: Function, data: any) => {
      const rval = f();
      if (!rval) {
        handler.call(this, data);
      }
    });
    return this;
  }

  on(event: string, handler: Function): this {
    const handlers = this._handlers[event];
    const wrapper = (f: Function, data: any) => {
      const rval = handler.call(this, data);
      if (!rval) {
        f();
      }
    };

    if (handlers !== undefined) {
      handlers.push(wrapper);
    } else {
      this._handlers[event] = [ wrapper ];
    }

    return this;
  }

  last(handler: Function): this {
    const handlers = this._handlers._last;
    const wrapper = (f: Function, event: string, data: any) => {
      const rval = handler.call(this, event, data);
      if (!rval) {
        f();
      }
    };

    if (handlers !== undefined) {
      handlers.push(wrapper);
    } else {
      this._handlers._last = [ wrapper ];
    }

    return this;
  }

  activate(): void {
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  toggle(): void {
    this._active = !this._active;
  }

  setActive(active: boolean): void {
    this._active = active;
  }

  isActive(): boolean {
    return this._active;
  }

  isInactive(): boolean {
    return !this._active;
  }

  private _implsend(handler: string, event: string, data: any): boolean {
    if (!this._active) {
      return false;
    }

    const handlers = this._handlers[handler];
    let rval = true;

    if (handlers !== undefined) {
      let i = 0;
      const _f = () => {
        i += 1;

        if (i < handlers.length) {
          if (handler === event) {
            handlers[i].call(this, _f, data);
          } else {
            handlers[i].call(this, _f, event, data);
          }
        } else {
          rval = false;
        }

        if (handler !== "_last") {
          return this._implsend("_last", event, data);
        } else {
          return rval;
        }
      };

      if (handler === event) {
        handlers[i].call(this, _f, data);
      } else {
        handlers[i].call(this, _f, event, data);
      }

      return rval;
    } else if (handler !== "_last") {
      return this._implsend("_last", event, data);
    } else {
      return false;
    }
  }
}
