import Engine from "./engine/engine";
import IO from "./engine/io";
import StageState from "./states/stage-state";

export default function Shmup(): IO<Engine> {
  return StageState(new Engine());
}
