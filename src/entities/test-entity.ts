import * as Immutable from "immutable";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import RenderComponent from "../components/render-component";

export default Immutable.Record({
  meta: undefined,
  position: new PositionComponent(),
  render: new RenderComponent({ x: 32, y: 32, width: 32, height: 32 }),
  movement: new MovementComponent(),
}, "TestEntity");
