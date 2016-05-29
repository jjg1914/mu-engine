export type Impl<T> =
  (_get: () => T, _set: (t: T) => void, _cb: (t: T) => void) => void;

export default class IO<T> {
  private _f: Impl<T>;

  public static Wrap<T>(t: T | IO<T>): IO<T> {
    if (t instanceof IO) {
      return t;
    } else {
      return new IO((_get: () => T,
                     _set: (t: T) => void,
                     cb: (t: T) => void) => {
        cb(t);
      });
    }
  }

  public static Thread<T>(funcs: ((t: T) => T | IO<T>)[]): IO<T> {
    return funcs.reduce((memo: IO<T>, value: (t: T) => T | IO<T>): IO<T> => {
      return memo.bind((t: T) => IO.Wrap(value(t)));
    }, IO.Wrap<T>(undefined));
  }

  public static Put<T>(t: T): IO<T> {
    return new IO((_get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      set(t);
      cb(t);
    });
  }

  public static Get<T>(): IO<T> {
    return new IO((get: () => T, _set: (t: T) => void, cb: (t: T) => void) => {
      cb(get());
    });
  }

  public static Delay<T>(n: Number): IO<T> {
    return new IO((get: () => T, _set: (t: T) => void, cb: (t: T) => void) => {
      setTimeout(() => cb(get()), n);
    });
  }

  public static All<T>(ios: IO<T>[]): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      let counter = 0;

      for (const io of ios) {
        io.run(get, set, (t: T) => {
          if (++counter === ios.length) {
            cb(t);
          }
        });
      }
    });
  }

  public constructor(f: Impl<T>) {
    this._f = f;
  }

  public bind(f: (t: T) => IO<T>): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      this._f(get, set, (t: T) => f(t).run(get, set, cb));
    });
  }

  public map(f: (t: T) => T): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      this._f(get, set, (t: T) => cb(f(t)));
    });
  }

  public run(get: () => T, set: (t: T) => void, cb: (t: T) => void): void {
    this._f(get, set, cb);
  }
}
