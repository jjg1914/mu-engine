import { Entity } from "../engine/engine";
import Path, { PathF } from "../engine/path";

export default function DronePath1(drone: Entity): PathF {
  return Path(drone, [
    [ 0, { dx: 45, dy: -45 } ],
    [ 3000, { x: 160, y: 160, dx: 45, dy: -45 } ],
    [ 1000, { x: -32, y: 32, dx: -45, dy: 0 } ],
    [ 1000, { x: -32, y: 32, dx: 0, dy: -45 } ],
  ]);
}
