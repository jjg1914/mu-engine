import "./poly";
import * as Immutable from "immutable";
import { Callback } from "./runtime";
export declare type Renderer<T> = (_cb: Callback<T>) => Callback<T>;
export interface Config {
    width?: number;
    height?: number;
    scale?: number;
    smoothing?: boolean;
}
export default function Render<T>(stage: HTMLCanvasElement, config?: Config): Renderer<T>;
export declare class Event extends Immutable.Map<string, any> {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}
