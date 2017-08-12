export type InputEventType = "keydown" | "keyup";

export interface InputEventData {
  type: InputEventType;
  which: number;
}

export class InputEvent implements InputEventData {
  type: InputEventType;
  which: number;

  constructor(type: InputEventType, which: number) {
    this.type = type;
    this.which = which;
  }
}
