import Runtime, { Callback } from "./engine/runtime";
import Engine from "./engine/engine";
import Interval from "./engine/interval";
import Render from "./engine/render";
import Input from "./engine/input";

import Shmup from "./shmup";

document.addEventListener("DOMContentLoaded", () => {
  Runtime(Shmup(), (cb: Callback<Engine>): void => {
    let stage = <HTMLCanvasElement> document.getElementById("stage");
    let renderer = Render(stage, {
      width: 208,
      height: 256,
      scale: 2,
      smoothing: false,
    });

    Interval(60, renderer(cb));
    Input(stage, cb);
  });
});
