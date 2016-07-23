import IO from "./io";

export type Callback<T> = (event: Object) => T;
export type Impl<T> = (cb: Callback<T>) => void;

export interface Runable {
  run(event: Object): this | IO<this>;
}

export interface State<T extends Runable> {
  state: T;
}

export default function Runtime<T extends Runable>(initial: T | IO<T>,
                                                   f: Impl<T>): State<T> {
  let state: State<T> = {
    state: undefined,
  };

  if (initial instanceof IO) {
    initial.run(() => state.state,
                (t: T) => state.state = t,
                (t: T) => state.state = t);
  } else {
    state.state = initial;
  }

  f((event: Object) => {
    if (event instanceof Error) {
      console.error(event);
    } else {
      let temp = state.state.run(event);

      if (temp instanceof IO) {
        temp.run(() => state.state,
                 (t: T) => state.state = t,
                 (t: T) => state.state = t);
      } else {
        state.state = temp;
      }
    }

    return state.state;
  });

  return state;
}
