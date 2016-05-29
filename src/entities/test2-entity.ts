import "../poly.d.ts";

import * as Immutable from "immutable";

import { Circle } from "../engine/shape";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import RenderComponent from "../components/render-component";

const mask = new Circle(10);

export default Immutable.Record({
  meta: undefined,
  position: (new PositionComponent(mask.dimensions())).set("mask", mask),
  render: new RenderComponent({
    shape: mask.path(),
    stroke: "#00b6E4",
    strokeWidth: 2,
  }),
  movement: new MovementComponent(),
}, "TestEntity");

