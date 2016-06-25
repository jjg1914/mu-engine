import * as Immutable from "immutable";

import { Polygon } from "../engine/shape";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import RenderComponent from "../components/render-component";
import TargetComponent from "../components/target-component";

const mask = new Polygon([
  [ 0, 20 ],
  [ 20, 20 ],
  [ 10, 0 ],
]);

export default Immutable.Record({
  meta: undefined,
  position: (new PositionComponent(mask.dimensions())).set("mask", mask),
  render: new RenderComponent({
    shape: mask.path(),
    stroke: "#00b6E4",
  }),
  movement: new MovementComponent({ restict: true }),
  target: new TargetComponent({ value: 1, group: "A" }),
}, "PlayerEntity");
