import Collision from "../util/collision";

export default class Camera {
  constructor(width, height) {
    this._bounds = {
      left: 0,
      top: 0,
      right: width,
      bottom: height,
    };
  }

  isInView(target) {
    return !!Collision.checkBounds(target, this._bounds);
  }

  position(x, y) {
    if (arguments.length === 0) {
      return [ this._bounds.left, this._bounds.top ];
    } else {
      this._bounds.right = x + (this._bounds.right - this._bounds.left);
      this._bounds.left = x;
      this._bounds.bottom = y + (this._bounds.bottom - this._bounds.top);
      this._bounds.top = y;
    }
  }

  dimensions(width, height) {
    if (arguments.length === 0) {
      return [
        this._bounds.right - this._bounds.left,
        this._bounds.bottom - this._bounds.top,
      ];
    } else {
      this._bounds.right = this.bottom.left + width;
      this._bounds.bottom = this.bottom.top + height;
    }
  }
}
