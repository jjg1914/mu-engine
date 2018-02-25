export type PathEventType = "path-end";

export interface PathEventData {
  type: PathEventType;
}

export class PathEvent implements PathEvent {
  type: PathEventType;

  constructor(options?: Partial<PathEventData>) {
    this.type = "path-end";

    Object.assign(this, options);
  }
}
