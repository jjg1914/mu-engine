import * as Immutable from "immutable";
import { Callback } from "./runtime";
export default function Interval<T>(rate: number, cb: Callback<T>): void;
export declare class Event extends Immutable.Map<string, any> {
    t: number;
    dt: number;
}
