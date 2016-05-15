import Runtime, { Callback } from "./engine/runtime";
import Interval from "./engine/interval";
import Shmup from "./shmup";

let _runtime = new Runtime(Shmup(), (cb: Callback): void => {
  Interval(30, cb);
});
