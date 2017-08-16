export type InputEventType = "keydown" | "keyup";

export type InputStateIndex = { [ key: string ]: boolean | null | undefined };

export interface InputEventData {
  type: InputEventType;
  which: string;
  inputs: InputStateIndex;
}

export class InputEvent implements InputEventData {
  type: InputEventType;
  which: string;
  inputs: InputStateIndex;

  constructor(type: InputEventType, which: string, inputs: InputStateIndex) {
    this.type = type;
    this.which = which;
    this.inputs = inputs;
  }
}
