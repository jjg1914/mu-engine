import { MoveEventData } from "../modules/move-module";
import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";
import { PositionData } from "../components/position-component";
import { MovementData } from "../components/movement-component";
import { PathData } from "../components/path-component";

export interface PathEntity extends Entity {
  position: PositionData;
  movement: MovementData;
  path: PathData;
}

export function PathSystem(klass: Constructor<PathEntity>)
: Constructor<PathEntity>{
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);

      this.on("premove", (event: MoveEventData) => {
        if (this.path.path != null) {
          if (this.path.t == null) {
            this.path.t = 0;
            this.path.x = this.position.x;
            this.path.y = this.position.y;
          } else {
            this.path.t += event.dt;
          }

          const [ x, y ] = this.path.path.interpolate(this.path.t,
                                                      this.path.repeat);
          let oldX = this.position.x;
          let oldY = this.position.y;

          this.position.x = Math.trunc(x) + this.path.x;
          this.position.y = Math.trunc(y) + this.path.y;

          this.movement.xChange = this.position.x - oldX;
          this.movement.yChange = this.position.y - oldY;
        }
      });
    }
  };
}
