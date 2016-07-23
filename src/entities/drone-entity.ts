import * as Immutable from "immutable";

import Engine, { Entity } from "../engine/engine";
import { Circle } from "../engine/shape";

import PlayerEntity from "./player-entity";
import PositionComponent from "../components/position-component";
import MovementComponent from "../components/movement-component";
import TargetComponent from "../components/target-component";
import RenderComponent from "../components/render-component";
import ShootComponent from "../components/shoot-component";

import DroneBulletEntity  from "../entities/drone-bullet-entity";

const mask = new Circle(8);

export default Immutable.Record({
  meta: undefined,
  position: (new PositionComponent(mask.dimensions())).set("mask", mask),
  render: new RenderComponent({
    shape: mask.path(),
    stroke: "#f33c6d",
  }),
  movement: new MovementComponent({ restrict: "remove" }),
  target: new TargetComponent({ value: 1, group: "B" }),
  shoot: new ShootComponent({
    delay: 1000,
    bullet: (engine: Engine, drone: Entity): Entity => {
      let ids = engine.get("entities").keySeq().map((e) => Number(e)).toJS();
      ids.sort();
      let player = engine.rdEntity(ids[0]);

      if (player instanceof PlayerEntity) {
        let droneX = drone.getIn([ "position", "x" ]);
        let droneY = drone.getIn([ "position", "y" ]);

        let dx = player.getIn([ "position", "x" ]) - droneX;
        let dy = player.getIn([ "position", "y" ]) - droneY;
        let mag = Math.sqrt((dx * dx) + (dy * dy));

        dx /= mag;
        dy /= mag;

        return (new DroneBulletEntity())
          .setIn([ "position", "x" ], droneX)
          .setIn([ "position", "y" ], droneY)
          .setIn([ "movement", "xSpeed" ], dx * 256)
          .setIn([ "movement", "ySpeed" ], dy * 256);
      }
    },
  }),
}, "BlockoidEntity");
