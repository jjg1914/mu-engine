import "../poly.d.ts";

import * as Immutable from "immutable";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import RenderComponent from "../components/render-component";

const shape = new Path2D();

shape.moveTo(0, 0);
shape.arc(3, 3, 3, 0, 2 * Math.PI);

export default Immutable.Record({
  meta: undefined,
  position: new PositionComponent({ width: 6, height: 6 }),
  render: new RenderComponent({
    shape: shape,
    fill: "#00b6E4",
  }),
  movement: new MovementComponent({ ySpeed: -256 }),
}, "TestEntity");
