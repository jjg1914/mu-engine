import * as Immutable from "immutable";
import { Callback } from "./runtime";
export default function Input<T>(stage: HTMLElement, cb: Callback<T>): void;
export declare enum EventType {
    UNKNOWN = 0,
    KEY_DOWN = 1,
    KEY_UP = 2,
}
export declare enum Keys {
    ARROW_LEFT = 37,
    ARROW_RIGHT = 39,
    ARROW_UP = 38,
    ARROW_DOWN = 40,
    SPACE = 32,
}
export declare class Event extends Immutable.Map<string, any> {
    which: number;
    type: EventType;
}
