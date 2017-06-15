export default class Engine {
  constructor(builder) {
    this._entityCounter = 0;
    this._entities = new Map();

    this._states = [];
    this._events = [];

    if (builder != null) {
      builder((event) => {
        this.emit(event);
      }, this);
    }
  }

  run(target, filters, f) {
    if (arguments.length === 2) {
      f = filters;
      filters = target;
      let funcs = _funcsFor(filters);

      for (let entity of this._entities) {
        if (_filter(entity[1], filters, funcs)) {
          f(entity[1]);
        }
      }
    } else if (target instanceof Array) {
      let funcs = _funcsFor(filters);

      for (let entity of target) {
        if (_filter(entity, filters, funcs)) {
          f(entity);
        }
      }
    } else if (target != null) {
      let funcs = _funcsFor(filters);

      if (_filter(target, filters, funcs)) {
        f(target);
      }
    }

    return this;
  }

  emit(event) {
    try {
      this._events.push(event);

      if (this._events.length === 1) {
        while (this._events.length > 0) {

          for (let state of this._states) {
            if (state.send(this._events[0], this)) {
              break;
            }
          }

          this._events.shift();
        }
      }

      return this;
    } catch (e) {
      this._events.length = 0;
      throw e;
    }
  }

  push(state) {
    this._states.unshift(state);
    this.emit({ type: "enter" });

    return this;
  }

  pop() {
    if (this._states.length > 0) {
      this.emit({ type: "leave" });
      this._states.shift();
    }

    return this;
  }

  swap(state) {
    return this.pop().push(state);
  }

  addEntity(entity) {
    this._entityCounter += 1;

    this._entities.set(this._entityCounter, entity);

    entity.meta = {
      id: this._entityCounter,
    };

    return entity;
  }

  removeEntity(entity) {
    this._entities.delete(entity.meta.id);
    delete entity.meta;

    return entity;
  }
}

function _filter(e, filters, funcs) {
  if (!_filterHasProperty("meta", e)) {
    return false;
  }

  for (let i = 0; i < filters.length; ++i) {
    if (!funcs[i](filters[i], e)) {
      return false;
    }
  }

  return true;
}

function _funcsFor(filters) {
  const rval = new Array(filters.length);

  for (let i = 0; i < rval.length; ++i) {
    if (filters[i][0] === "!") {
      rval[i] = _filterNHasProperty;
    } else {
      rval[i] = _filterHasProperty;
    }
  }

  return rval;
}

function _filterHasProperty(f, e) {
  return e.hasOwnProperty(f);
}

function _filterNHasProperty(f, e) {
  return !e.hasOwnProperty(f.substr(1));
}
