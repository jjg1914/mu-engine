import { Entity } from "../entities/entity";
import { Constructor } from "../util/mixin";

function normalizeKey(ev: KeyboardEvent) {
  return ev.keyCode;
}

export interface InputEventData {
  type: "keydown" | "keyup";
  which: number;
}

export class InputEvent implements InputEventData {
  type: "keydown" | "keyup";
  which: number;

  constructor(type: "keydown" | "keyup", which: number) {
    this.type = type;
    this.which = which;
  }
}

export interface InputConfig {
  input: {
    canvas: HTMLElement;
  }
}

export function InputModule(klass: Constructor<Entity>): Constructor<Entity> {
  return class extends klass {
    constructor(...args: any[]) {
      super(...args);
      const config: InputConfig = args[0];

      config.input.canvas.setAttribute("tabindex", "1");

      config.input.canvas.addEventListener("keydown", (ev) => {
        if (!ev.repeat) {
          this.send("keydown", new InputEvent("keydown", normalizeKey(ev)));
        }
      });

      config.input.canvas.addEventListener("keyup", (ev) => {
        this.send("keyup", new InputEvent("keyup", normalizeKey(ev)));
      });
    }
  };
}

export const Keys = {
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  SPACE: 32,
}
