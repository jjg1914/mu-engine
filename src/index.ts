import Runtime, { Callback } from "./engine/runtime";
import Interval from "./engine/interval";
import Render from "./engine/render";
import Input from "./engine/input";

import Shmup from "./shmup";

document.addEventListener("DOMContentLoaded", () => {
  let _runtime = new Runtime(Shmup(), (cb: Callback): void => {
    let stage = <HTMLCanvasElement> document.getElementById("stage");
    let renderer = Render(stage);

    Interval(30, renderer(cb));
    Input(stage, cb);
  });
});
