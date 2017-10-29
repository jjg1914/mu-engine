import { Entity } from "../entities/entity";
import { shapeFor } from "../modules/shape";
import { MoveEventData } from "../events/move-event";
import { MovementData } from "../components/movement-component";
import { PositionData } from "../components/position-component";

export interface RestrictEntity extends Entity {
  position: PositionData;
  movement: MovementData;
}

export function RestrictSystem(entity: RestrictEntity): void {
  entity.on("move", (event: MoveEventData) => {
    if (entity.movement.restrict) {
      const restrict = (entity.movement.restrict instanceof Array ?
                        entity.movement.restrict :
                        [ 0, 0 ] as [ number, number ]);

      const b = shapeFor(entity).bounds();
      const w = b.right - b.left + 1;
      const h = b.bottom - b.top + 1;
      const oldX = entity.position.x;
      const oldY = entity.position.y;

      const restrictX = restrict[0];
      const restrictY = restrict[1];

      if (restrictX != null) {
        if (restrictX >= 0) {
          entity.position.x = Math.min(event.bounds.right - w + 1,
                                       entity.position.x);
        }

        if (restrictX <= 0) {
          entity.position.x = Math.max(event.bounds.left,
                                       entity.position.x);
        }
      }

      if (restrictY != null) {
        if (restrictY >= 0) {
          entity.position.y = Math.min(event.bounds.bottom - h + 1,
                                       entity.position.y);
        }

        if (restrictY <= 0) {
          entity.position.y = Math.max(event.bounds.top,
                                       entity.position.y);
        }
      }

      if (entity.position.x !== oldX) {
        entity.movement.xSpeed = 0;
      }

      if (entity.position.y !== oldY) {
        entity.movement.ySpeed = 0;
      }
    }
  });
}
