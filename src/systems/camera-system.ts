import { shapeFor, Bounds, PositionEntity, Dimensions } from "../util/shape";
import { Constructor } from "../util/mixin";
import { RenderEventData } from "../modules/render-module";

export interface CameraConfig {
  camera: {
    bounds: Bounds;
    dimensions: Dimensions;
  }
}

export function CameraSystem(klass: Constructor<PositionEntity>)
: Constructor<PositionEntity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);
      const config: CameraConfig = args[0];

      this.on("prerender", (ev: RenderEventData) => {
        const targetBounds = shapeFor(this).bounds();
        const cameraW =  config.camera.dimensions.width;
        const cameraH =  config.camera.dimensions.height;

        let [ x, y ] = [
          (targetBounds.left + targetBounds.right) / 2,
          (targetBounds.top + targetBounds.bottom) / 2,
        ];

        x -= cameraW / 2;
        y -= cameraH / 2;

        x = Number((Math.floor(x) + (targetBounds.left % 1)).toFixed(4));
        y = Number((Math.floor(y) + (targetBounds.top % 1)).toFixed(4));

        x = Math.min(Math.max(x, config.camera.bounds.left),
                     config.camera.bounds.right - cameraW);
        y = Math.min(Math.max(y, config.camera.bounds.top),
                     config.camera.bounds.bottom - cameraH);

        ev.viewport.left = x;
        ev.viewport.top = y;
        ev.viewport.right = x + cameraW - 1;
        ev.viewport.bottom = y + cameraH - 1;
      });
    }
  };
}
