import * as Immutable from "immutable";

export default Immutable.Record({
  xSpeed: 0,
  ySpeed: 0,
  restrict: false,
  path: undefined,
  pathT: 0,
}, "MovementComponent");
