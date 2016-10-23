import IO from "./io";
export declare type Pair<T> = [number, (t: T) => IO<T>];
export default function Timeline<T>(timeline: Pair<T>[]): IO<T>;
