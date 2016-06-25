import * as Immutable from "immutable";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import AnimateComponent from "../components/animate-component";
import TargetComponent from "../components/target-component";
import RenderComponent from "../components/render-component";

export default Immutable.Record({
  meta: undefined,
  position: new PositionComponent({
    width: 24,
    height: 24,
    rotate: Math.PI / 4,
  }),
  render: new RenderComponent({
    stroke: "#aeea1c",
    strokeWidth: 1,
  }),
  movement: new MovementComponent({
    ySpeed: 32,
    restrict: "remove",
  }),
  animate: new AnimateComponent({
    rotateSpeed: Math.PI / 4,
  }),
  target: new TargetComponent({ value: 3, group: "B" }),
}, "BlockoidEntity");
