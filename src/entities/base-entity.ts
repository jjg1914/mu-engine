import { Entity } from "./entity";

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

  private static _pushSendFrame(target: BaseEntity,
                                handle: string,
                                event: string,
                                data: any) {
    if (BaseEntity._sendFrameIndex == BaseEntity._sendFrames.length) {
      const cap = (Math.max(BaseEntity._sendFrames.length, 8)) * 2;

      while (BaseEntity._sendFrames.length < cap) {
        BaseEntity._sendFrames.push({
          target: undefined as any,
          index: 0,
          handle: "",
          event: "",
          data: undefined as any,
          rval: true,
        })
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
          handlers[i].call(frame.target, BaseEntity._dispatchFunc, frame.data);
        } else {
          handlers[i].call(frame.target, BaseEntity._dispatchFunc, frame.event, frame.data);
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
    if (this._active) {
      return BaseEntity._sendImpl(this, event, event, data);
    } else {
      return false;
    }
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
}
