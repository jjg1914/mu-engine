export declare type Impl<T> = (_get: () => T, _set: (t: T) => void, _cb: (t: T) => void) => void;
export default class IO<T> {
    private _f;
    static Wrap<T>(t: T | IO<T>): IO<T>;
    static Thread<T>(funcs: ((t: T) => T | IO<T>)[]): IO<T>;
    static Put<T>(t: T): IO<T>;
    static Get<T>(): IO<T>;
    static Delay<T>(n: Number): IO<T>;
    static All<T>(ios: IO<T>[]): IO<T>;
    static Noop<T>(): IO<T>;
    constructor(f: Impl<T>);
    bind(f: (t: T) => IO<T>): IO<T>;
    map(f: (t: T) => T): IO<T>;
    run(get: () => T, set: (t: T) => void, cb: (t: T) => void): void;
}
