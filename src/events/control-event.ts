export type ControlEventType = "start-left" |
                               "start-right" |
                               "start-up" |
                               "start-down" |
                               "stop-left" |
                               "stop-right" |
                               "stop-up" |
                               "stop-down";

export interface ControlEventData {
  type: ControlEventType;
}

export class ControlEvent implements ControlEventData {
  type: ControlEventType;

  constructor(type: ControlEventType) {
    this.type = type;
  }
}
