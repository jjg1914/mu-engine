import { shapeFor } from "../util/shape";

export default class CameraSystem {
  constructor(camera, target, bounds) {
    this._camera = camera;
    this._target = target;
    this._bounds = bounds;
  }

  render(event, engine) {
    engine.run(this._target, [ "position" ], (e) => {
      const targetBounds = shapeFor(e).bounds();
      const [ cameraW, cameraH ] = this._camera.dimensions();

      let [ x, y ] = [
        (targetBounds.left + targetBounds.right) / 2,
        (targetBounds.top + targetBounds.bottom) / 2,
      ];

      x -= cameraW / 2;
      y -= cameraH / 2;

      x = Number((Math.floor(x) + (targetBounds.left % 1)).toFixed(4));
      y = Number((Math.floor(y) + (targetBounds.top % 1)).toFixed(4));

      x = Math.min(Math.max(x, this._bounds.left),
                   this._bounds.right - cameraW);
      y = Math.min(Math.max(y, this._bounds.top),
                   this._bounds.bottom - cameraH);

      this._camera.position(x, y);
    });
  }
}
