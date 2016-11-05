import * as Immutable from "immutable";

export default Immutable.Record({
  fill: undefined,
  stroke: undefined,
  strokeWidth: 1,
  shape: undefined, // TODO rename mask
}, "RenderComponent");
