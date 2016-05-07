class IO<T> {
  constructor(f: IO.Impl<T>) {
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

  private _f: IO.Impl<T>;
}

module IO {
  export type Impl<T> =
    (get: () => T, set: (t: T) => void, cb: (t: T) => void) => void;

  export function Put<T>(t: T): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      set(t);
      cb(t);
    });
  }

  export function Get<T>(): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      cb(get());
    });
  }

  export function Delay<T>(n: Number): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      setTimeout(() => cb(get()), n);
    });
  }

  export function All<T>(ios: IO<T>[]): IO<T> {
    return new IO((get: () => T, set: (t: T) => void, cb: (t: T) => void) => {
      let counter = 0;

      for (const io of ios) {
        io.run(get, set, (t: T) => {
          if (++counter == ios.length) {
            cb(t);
          }
        });
      }
    })
  }
}

export default IO;
