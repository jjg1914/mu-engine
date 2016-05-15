import Engine from "./engine/engine";
import { Event } from "./engine/interval";

export default function Shmup(): Engine {
  return new Engine().pushState((engine: Engine, event: Object): Engine => {
    if (event instanceof Event) {
      console.log(event.dt);
    }

    return engine;
  });
}
