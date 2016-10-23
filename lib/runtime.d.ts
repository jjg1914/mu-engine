import IO from "./io";
export declare type Callback<T> = (event: Object) => T;
export declare type Impl<T> = (cb: Callback<T>) => void;
export interface Runable {
    run(event: Object): this | IO<this>;
}
export interface State<T extends Runable> {
    state: T;
}
export default function Runtime<T extends Runable>(initial: T | IO<T>, f: Impl<T>): State<T>;
