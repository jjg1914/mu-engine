import * as Immutable from "immutable";
import Engine, { Entity } from "./engine";
import { Bounds } from "./shape";
export default function Collision(engine: Engine, width: number, height: number): Node;
export declare class Node extends Immutable.Map<string, any> implements Bounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
    children: Immutable.List<Node>;
    entities: Immutable.List<[Bounds, Entity]>;
    query(entity: Entity, bounds?: Bounds): Immutable.Map<string, Entity>;
}
