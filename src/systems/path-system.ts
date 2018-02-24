import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";
import { PathData } from "../components/path-component";

import { PathEvent } from "../events/path-event";

export interface PathEntity extends Entity {
  position: PositionData;
  movement: MovementData;
  path: PathData;
}

export function PathSystem(entity: PathEntity): void {
  entity.on("premove", (event: MoveEventData) => {
    if (entity.path.path !== undefined) {
      if (entity.path.t === undefined) {
        entity.path.t = 0;
        entity.path.x = entity.position.x;
        entity.path.y = entity.position.y;
      } else {
        entity.path.t += event.dt;
      }

      if (!entity.path.repeat && entity.path.t > entity.path.path.duration()) {
        entity.path.path = undefined;

        entity.send("path-end", new PathEvent());
      } else {
        const [ x, y ] = entity.path.path.interpolate(entity.path.t,
                                                      entity.path.repeat,
                                                      entity.path.x,
                                                      entity.path.y);
        let oldX = entity.position.x;
        let oldY = entity.position.y;

        entity.position.x = Math.trunc(x);
        entity.position.y = Math.trunc(y);

        entity.movement.xChange = entity.position.x - oldX;
        entity.movement.yChange = entity.position.y - oldY;
      }
    }
  });
}
