import * as Immutable from "immutable";

import { Circle } from "../engine/shape";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import TargetComponent from "../components/target-component";
import RenderComponent from "../components/render-component";

const mask = new Circle(8);

export default Immutable.Record({
  meta: undefined,
  position: (new PositionComponent(mask.dimensions())).set("mask", mask),
  render: new RenderComponent({
    shape: mask.path(),
    stroke: "#f33c6d",
  }),
  movement: new MovementComponent(),
  target: new TargetComponent({ value: 1 }),
}, "BlockoidEntity");
