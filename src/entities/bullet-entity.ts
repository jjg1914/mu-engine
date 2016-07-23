import * as Immutable from "immutable";

import { Circle } from "../engine/shape";

import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import DamageComponent from "../components/damage-component";
import RenderComponent from "../components/render-component";
import EmitterComponent from "../components/emitter-component";

const mask = new Circle(1.5);

export default Immutable.Record({
  meta: undefined,
  position: (new PositionComponent(mask.dimensions())).set("mask", mask),
  render: new RenderComponent({
    shape: mask.path(),
    fill: "#00b6E4",
  }),
  movement: new MovementComponent({ ySpeed: -256, restrict: "remove" }),
  damage: new DamageComponent({ value: 1, group: "A" }),
  emitter: new EmitterComponent({
    frequency: 50,
    lifetime: 50,
    fill: "#005399",
  }),
}, "BulletEntity");
