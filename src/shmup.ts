var Engine = require("./engine/engine.js");

module.exports = function Shmup() {
  return Engine().pushState(function(engine, event) {
    switch (event.type) {
    case "interval":
      return engine.runSystem(RenderSystem)
    default:
      return engine;
    }
  });
};
