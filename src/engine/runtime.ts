import IO from "./io";

export type Callback<T> = (event: Object) => T;
export type Impl<T> = (cb: Callback<T>) => void;

export interface Runable {
  run(event: Object): this | IO<this>;
}

export default function Runtime<T extends Runable>(initial: T | IO<T>,
                                                   f: Impl<T>) {
  let state;

  if (initial instanceof IO) {
    initial.run(() => state,
                (t: T) => state = t,
                (t: T) => state = t);
  } else {
    state = initial;
  }

  f((event: Object) => {
    if (event instanceof Error) {
      console.error(event);
    } else {
      let temp = state.run(event);

      if (temp instanceof IO) {
        temp.run(() => state,
                 (t: T) => state = t,
                 (t: T) => state = t);
      } else {
        state = temp;
      }
    }

    return state;
  });
}
