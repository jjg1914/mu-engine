import { Entity } from "./engine";
export interface Node {
    t?: number;
    x?: number;
    y?: number;
    dx?: number;
    dy?: number;
    linear?: boolean;
    absolute?: boolean;
}
export declare type PathF = (t: number) => [number, number];
export default function Path(entity: Entity, path: Node[]): PathF;
