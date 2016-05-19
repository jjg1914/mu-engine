import * as Immutable from "immutable";
import { Callback } from "./runtime";

function normalizeKey(ev: KeyboardEvent): number {
  return ev.keyCode;
}

export default function Input(stage: HTMLElement, cb: Callback): void {
  stage.setAttribute("tabindex", "1");

  stage.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!ev.repeat) {
      cb(new Event({
        type: EventType.KEY_DOWN,
        which: normalizeKey(ev),
      }));
    }
  });

  stage.addEventListener("keyup", (ev: KeyboardEvent) => {
    cb(new Event({
      type: EventType.KEY_UP,
      which: normalizeKey(ev),
    }));
  });
}

export enum EventType {
  UNKNOWN,
  KEY_DOWN,
  KEY_UP,
}

export enum Keys {
  ARROW_LEFT = 37,
  ARROW_RIGHT = 39,
  ARROW_UP = 38,
  ARROW_DOWN = 40,
}

export class Event extends Immutable.Record({
  type: EventType.UNKNOWN,
  which: "",
}) {
  public which: number;
  public type: EventType;
}
