export default class PathComponent {
  constructor(options = {}) {
    this.path = options.path;
    this.repeat = (options.repeat != null ? options.repeat : false);
    this.t = null;
    this.x = null;
    this.y = null;
  }
}
