import * as Immutable from "immutable";

import { Polygon } from "../engine/shape";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import TargetComponent from "../components/target-component";
import RenderComponent from "../components/render-component";

export default Immutable.Record({
  meta: undefined,
  position: new PositionComponent({
    width: 24,
    height: 24,
  }),
  render: new RenderComponent({
    stroke: "#aeea1c",
    strokeWidth: 1,
  }),
  movement: new MovementComponent({
    ySpeed: 32,
  }),
  target: new TargetComponent(),
}, "BlockoidEntity");
