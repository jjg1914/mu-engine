///<reference path="../../node_modules/immutable/dist/immutable.d.ts"/>

import * as Immutable from "immutable";

class Engine extends Immutable.Record({
  entities: Immutable.Map(),
  state: Immutable.Stack(),
  id: 0,
}) {
  mkEntity(entity: Engine.Entity): Engine {
    var newId = (this.id + 1).toString();
    var newEntity = entity.set("meta", new Engine.MetaComponent({ id: newId }));

    return <Engine> this.setIn([ "entities", newId ], newEntity)
      .set("id", Number(newId));
  };

  upEntity(entity: Engine.Entity): Engine {
    let id = entity.getIn([ "meta", "id" ]);

    return <Engine> this.setIn([ "entities", id  ], entity);
  };

  rmEntity(entity: Engine.Entity): Engine {
    let id = entity.getIn([ "meta", "id" ]);

    return <Engine> this.deleteIn([ "entities", id ]);
  };

  pushState(state: Engine.System): Engine {
    return <Engine> this.set("state", this.state.push(state));
  };

  popState(): Engine {
    return <Engine> this.set("state", this.state.pop());
  };

  runState(event: any): Engine {
    return this.runSystem(this.state.peek(), event);
  };

  runSystem(system: Engine.System, event: any): Engine {
    return system(this, event);
  };

  runIterator(filters: string[],
              iterator: Engine.Iterator<Engine>): Engine {
    return this.runIteratorOn(filters, iterator, this);
  }

  runIteratorOn<T>(filters: string[],
                 iterator: Engine.Iterator<T>,
                 initial: T): T {
    return this.entities.filter(function(e) {
      return filters.every(function(f) { return e.get(f) != null });
    }).reduce(iterator, initial);
  };

  public entities: Immutable.Map<string, Engine.Entity>;
  public state: Immutable.Stack<Engine.System>;
  public id: number;
}

module Engine {
  export type Component = Immutable.Map<string,any>;
  export type Entity = Immutable.Map<string,Component>;
  export type System = (engine: Engine, event: any) => Engine;
  export type Iterator<T> = (value: T, entity: Entity) => T;

  export class MetaComponent extends Immutable.Record({ id: 0 }) {
    public id: number;
  }
}

export default Engine;
