export default class MovementComponent {
  constructor(options = {}) {
    this.xSpeed = options.xSpeed != null ? options.xSpeed : 0;
    this.ySpeed = options.ySpeed != null ? options.ySpeed : 0;

    this.xAccel = options.xAccel != null ? options.xAccel : 0;
    this.yAccel = options.yAccel != null ? options.yAccel : 0;

    this.xMax = options.xMax != null ? options.xMax : null;
    this.yMax = options.yMax != null ? options.yMax : null;

    this.xSubpixel = options.xSubpixel != null ? options.xSubpixel : 0;
    this.ySubpixel = options.ySubpixel != null ? options.ySubpixel : 0;

    this.xChange = options.xChange != null ? options.xChange : 0;
    this.yChange = options.yChange != null ? options.yChange : 0;

    this.friction = options.friction != null ? options.friction : null;

    this.restrict = options.restrict != null ? options.restrict : false;
  }
}
