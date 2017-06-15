export default class PositionComponent {
  constructor(options = {}) {
    this.x = options.x != null ? options.x : 0;
    this.y = options.y != null ? options.y : 0;
    this.width = options.width != null ? options.width : 0;
    this.height = options.height != null ? options.height: 0;
    this.solid = options.solid != null ? options.solid : false;
    this.ignoreSolid = options.ignoreSolid != null ? options.ignoreSolid : false;
    this.position = options.landing != null ? options.landing : null;
  }
}
