import * as Immutable from "immutable";
import { Runable } from "./runtime";
import IO from "./io";
export declare type Value = string | number | Function;
export declare type Component = Immutable.Map<string, Value>;
export declare type Entity = Immutable.Map<string, Component>;
export declare type System = (engine: Engine, event: Object) => Engine | IO<Engine>;
export declare type Iterator<T> = (value: T, entity: Entity) => T;
export declare type IOIterator<T> = (entity: Entity) => IO<T>;
export declare class MetaComponent extends Immutable.Map<string, any> {
    id: number;
}
export default class Engine extends Immutable.Map<string, any> implements Runable {
    private entities;
    private state;
    private id;
    mkEntity(entity: Entity): Engine;
    upEntity(entity: Entity): Engine;
    patchEntity(entity: Entity | number, patch: Object | Entity): Engine;
    rmEntity(entity: Entity | number): Engine;
    rdEntity(entity: Entity | number): Entity;
    lastEntity(): Entity;
    lastId(): number;
    pushState(state: System): Engine;
    popState(): Engine;
    run(event: Object): this | IO<this>;
    runSystem(system: System, event: Object): Engine | IO<Engine>;
    runIterator(filters: string[], iterator: Iterator<Engine>): Engine;
    runIteratorOn<T>(filters: string[], iterator: Iterator<T>, initial: T): T;
    runIOIterator<T>(filters: string[], iterator: IOIterator<T>): IO<T>;
}
