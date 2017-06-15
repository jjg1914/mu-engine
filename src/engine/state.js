export default class State {
  constructor(builder) {
    this._systems = [];
  }

  send(event, engine) {
    const type = (event instanceof Error ? "error" : event.type);
    let rval = false;

    for (let system of this._systems) {
      if (typeof system[type] === "function") {
        system[type](event, engine);
        rval = true;
      }
    }

    return rval;
  }

  addSystem(system) {
    this._systems.push(system);

    return this;
  }
}
