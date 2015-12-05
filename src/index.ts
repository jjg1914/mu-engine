///<reference path="../node_modules/immutable/dist/immutable.d.ts"/>
import Immutable = require("immutable");

module Mu {
  export interface Entity extends Immutable.Map<string, Immutable.Map<string, any>> {}

  export interface Engine extends Immutable.Map<number, Entity> {}

  export interface System {
    (engine: Engine, entity: Entity): Engine;
  }

  export class MetaComponent extends Immutable.Record({ id: 123 }) {}

  export function Engine(): Engine {
    return Immutable.Map<number, Entity>();
  }

  export function mkEntity(engine: Engine, entity: Entity): Engine {
    var id = Math.floor(Math.random() * 1024 * 1024 * 1024);
    entity = entity.set("meta", new MetaComponent({ id: id }));
    return engine.set(entity.get("meta").get("id"), entity);
  }

  export function upEntity(engine: Engine, entity: Entity): Engine {
    return engine.set(entity.get("meta").get("id"), entity);
  }

  export function rmEntity(engine: Engine, entity: Entity): Engine {
    return engine.remove(entity.get("meta").get("id"));
  }

  export function runSystem(engine: Engine, filters: Immutable.List<string>,
            system: System): Engine {
    return engine.reduce(function(m: Engine, v: Entity): Engine {
      if (filters.every(function(s: string) { return v.has(s); })) {
        return system(m, v);
      } else {
        return m;
      }
    }, engine);
  }
}

export = Mu
