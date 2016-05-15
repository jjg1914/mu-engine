import * as Immutable from "immutable";

export type Value = string | number | Function;
export type Component = Immutable.Map<string, Value>;
export type Entity = Immutable.Map<string,Component>;
export type System = (engine: Engine, event: Object) => Engine;
export type Iterator<T> = (value: T, entity: Entity) => T;
