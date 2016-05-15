import IO from "./io";

export type Callback = (event: Object) => void;
export type Impl = (cb: Callback) => void;

export interface Runable {
  run(event: Object): this | IO<this>;
}

export default class Runtime<T extends Runable> {
  private state: T;

  public constructor(initial: T, f: Impl) {
    this.state = initial;

    f((event: Object) => {
      if (event instanceof Error) {
        console.error(event);
      } else {
        let temp = this.state.run(event);

        if (temp instanceof IO) {
          temp.run(() => this.state,
                   (t: T) => this.state = t,
                   (t: T) => this.state = t);
        } else {
          this.state = temp;
        }
      }
    });
  }
}
