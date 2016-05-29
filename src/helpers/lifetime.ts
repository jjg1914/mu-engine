import Engine, { Entity } from "../engine/engine";
import IO from "../engine/io";

export default function Lifetime(delay: number,
                                 entity: Entity | number): IO<Engine> {
  return IO.Thread<Engine>([
    (_e: Engine): IO<Engine> => IO.Delay(delay),
    (e: Engine): IO<Engine> => { 
      return IO.Put(e.rmEntity(entity));
    },
  ])
}
