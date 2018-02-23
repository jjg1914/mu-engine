import { Entity } from "./entity";

export interface BaseEntityConfig {
}

export class BaseEntity implements Entity {
  private static _idCounter: number = 0;
  private static _sendFrameIndex: number = 0;
  private static _sendFrames: ({
    target: BaseEntity;
    index: number;
    handle: string;
    event: string;
    data: any;
    rval: boolean;
  })[] = [];

  id: number;
  parent?: Entity;

  private _handlers: { [event: string]: [ Function, Function ][] | undefined };
  private _active: boolean;

  constructor(_config?: BaseEntityConfig) {
    this.id = ++BaseEntity._idCounter;
    this._handlers = {};
    this._active = true;
  }

  private static _pushSendFrame(target: BaseEntity,
                                handle: string,
                                event: string,
                                data: any) {
    if (BaseEntity._sendFrameIndex === BaseEntity._sendFrames.length) {
      const cap = (Math.max(BaseEntity._sendFrames.length, 8)) * 2;

      while (BaseEntity._sendFrames.length < cap) {
        BaseEntity._sendFrames.push({
          target: undefined as any,
          index: 0,
          handle: "",
          event: "",
          data: undefined as any,
          rval: true,
        });
      }
    }

    const frame = BaseEntity._sendFrames[BaseEntity._sendFrameIndex];
    frame.index = 0;
    frame.target = target;
    frame.handle = handle;
    frame.event = event;
    frame.data = data;
    frame.rval = true;

    BaseEntity._sendFrameIndex += 1;
  }

  private static _popSendFrame() {
    BaseEntity._sendFrameIndex -= 1;
  }

  private static _dispatchFunc(): boolean {
    const frame = BaseEntity._sendFrames[BaseEntity._sendFrameIndex - 1];
    const handlers = frame.target._handlers[frame.handle];

    if (handlers !== undefined) {
      const i = frame.index;
      frame.index += 1;

      if (i < handlers.length) {
        if (frame.handle === frame.event) {
          handlers[i][0].call(frame.target,
                              BaseEntity._dispatchFunc,
                              frame.data);
        } else {
          handlers[i][0].call(frame.target,
                              BaseEntity._dispatchFunc,
                              frame.event,
                              frame.data);
        }
      } else if (frame.handle !== "_last") {
        frame.rval = BaseEntity._sendImpl(frame.target,
                                          "_last",
                                          frame.event,
                                          frame.data);
      } else {
        frame.rval = false;
      }
    } else if (frame.handle !== "_last") {
      frame.rval = BaseEntity._sendImpl(frame.target,
                                        "_last",
                                        frame.event,
                                        frame.data);
    } else {
      frame.rval = false;
    }

    return frame.rval;
  }

  private static _sendImpl(target: BaseEntity,
                           handle: string,
                           event: string,
                           data: any): boolean {
    BaseEntity._pushSendFrame(target, handle, event, data);

    try {
      return BaseEntity._dispatchFunc();
    } finally {
      BaseEntity._popSendFrame();
    }
  }

  send(event: string, data: any): boolean {
    if (this._active) {
      return BaseEntity._sendImpl(this, event, event, data);
    } else {
      return false;
    }
  }

  around(event: string, handler: Function): this {
    this._fetchHandlers(event).unshift([ handler, handler ]);

    return this;
  }

  before(event: string, handler: Function): this {
    this._fetchHandlers(event).unshift([ (f: Function, data: any) => {
      const rval = handler.call(this, data);
      if (!rval) {
        f();
      }
    }, handler ]);

    return this;
  }

  after(event: string, handler: Function): this {
    this._fetchHandlers(event).unshift([ (f: Function, data: any) => {
      const rval = f();
      if (!rval) {
        handler.call(this, data);
      }
    }, handler ]);

    return this;
  }

  on(event: string, handler: Function): this {
    this._fetchHandlers(event).push([ (f: Function, data: any) => {
      const rval = handler.call(this, data);
      if (!rval) {
        f();
      }
    }, handler ]);

    return this;
  }

  last(handler: Function): this {
    this._fetchHandlers("_last").push([
      (f: Function, event: string, data: any) => {
        const rval = handler.call(this, event, data);
        if (!rval) {
          f();
        }
      },
      handler,
    ]);

    return this;
  }

  off(handler: Function): this {
    for (let e in this._handlers) {
      if (this._handlers.hasOwnProperty(e)) {
        const handlers = this._fetchHandlers(e);

        for (let i = 0; i < handlers.length;) {
          if (handlers[i][1] === handler) {
            handlers.splice(i, 1);
          } else {
            i += 1;
          }
        }
      }
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

  private _fetchHandlers(event: string): ([ Function | Function ])[] {
    const handlers = this._handlers[event];

    if (handlers === undefined) {
      return (this._handlers[event] = []);
    } else {
      return handlers;
    }
  }
}
