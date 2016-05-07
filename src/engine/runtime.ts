import IO from "./io";

class Runtime<T extends Runtime.Runable<T>> {
  constructor(initial: T, f: Runtime.Impl) {
    this.state = initial;

    f((event: any) => {
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

  private state: T;
}

module Runtime {
  export type Callback = (event: any) => void;
  export type Impl = (cb: Callback) => void;

  export interface Runable<T> {
    run(any): T | IO<T>;
  }
}

export default Runtime;
