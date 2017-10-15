import { Entity } from "../entities/entity";
import { InputEvent, InputStateIndex } from "../events/input-event";

export interface InputConfig {
  canvas: HTMLElement;
}

export function InputSystem(entity: Entity, config: InputConfig): void {
  const _inputs: InputStateIndex = {};

  config.canvas.setAttribute("tabindex", "1");

  config.canvas.addEventListener("keydown", (ev) => {
    if (!ev.repeat) {
      const key = _normalizeKey(ev);
      _inputs[key] = true;
      entity.send("keydown", new InputEvent("keydown", key, _inputs));
    }
  });

  config.canvas.addEventListener("keyup", (ev) => {
    const key = _normalizeKey(ev);
    _inputs[key] = false;
    entity.send("keyup", new InputEvent("keyup", key, _inputs));
  });
}

function _normalizeKey(ev: KeyboardEvent) {
  if (ev.key.length == 1) {
    return ev.key.toUpperCase();
  } else {
    return ev.key;
  }
}
