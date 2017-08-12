import { Entity } from "../entities/entity";
import { InputEvent } from "../events/input-event";

export const Keys = {
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  SPACE: 32,
}

export interface InputConfig {
  input: {
    canvas: HTMLElement;
  }
}

export function InputModule(entity: Entity, config: InputConfig): void {
  config.input.canvas.setAttribute("tabindex", "1");

  config.input.canvas.addEventListener("keydown", (ev) => {
    if (!ev.repeat) {
      entity.send("keydown", new InputEvent("keydown", _normalizeKey(ev)));
    }
  });

  config.input.canvas.addEventListener("keyup", (ev) => {
    entity.send("keyup", new InputEvent("keyup", _normalizeKey(ev)));
  });
}

function _normalizeKey(ev: KeyboardEvent) {
  return ev.keyCode;
}
