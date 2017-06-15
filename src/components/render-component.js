export default class RenderComponent {
  constructor(options = {}) {
    this.stroke = options.stroke != null ? options.stroke : null;
    this.fill = options.fill != null ? options.fill : "#000000";
  }
}
