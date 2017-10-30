export type ControlEventType = "start-left" |
                               "start-right" |
                               "stop-left" |
                               "stop-right";

export interface ControlEventData {
  type: ControlEventType;
}

export class ControlEvent implements ControlEventData {
  type: ControlEventType;

  constructor(type: ControlEventType) {
    this.type = type;
  }
}
