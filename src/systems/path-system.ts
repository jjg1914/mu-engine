import { MoveEventData } from "../events/move-event";
import { Entity } from "../entities/entity";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";
import { PathData } from "../components/path-component";

export interface PathEntity extends Entity {
  position: PositionData;
  movement: MovementData;
  path: PathData;
}

export function PathSystem(entity: PathEntity): void {
  entity.on("premove", (event: MoveEventData) => {
    if (entity.path.path != null) {
      if (entity.path.t == null) {
        entity.path.t = 0;
        entity.path.x = entity.position.x;
        entity.path.y = entity.position.y;
      } else {
        entity.path.t += event.dt;
      }

      const [ x, y ] = entity.path.path.interpolate(entity.path.t,
                                                    entity.path.repeat);
      let oldX = entity.position.x;
      let oldY = entity.position.y;

      entity.position.x = Math.trunc(x) + entity.path.x;
      entity.position.y = Math.trunc(y) + entity.path.y;

      entity.movement.xChange = entity.position.x - oldX;
      entity.movement.yChange = entity.position.y - oldY;
    }
  });
}
