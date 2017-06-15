import Engine from "../engine/engine";

export function Runtime(f) {
  document.addEventListener("DOMContentLoaded", () => {
    new Engine((cb, engine) => {
      f(engine, cb);
    });
  });
}
