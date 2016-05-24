import * as Immutable from "immutable";

import { Callback } from "./runtime";

export type Renderer = (_cb: Callback) => Callback;

export default function Render(stage: HTMLCanvasElement): Renderer {
  if (typeof stage.getContext !== "function") {
    throw new Error("Canvas not supported");
  }

  let buffer = <HTMLCanvasElement> document.createElement("canvas");
  let stageCtx = stage.getContext("2d");
  let bufferCtx = buffer.getContext("2d");

  let height = parseInt(window.getComputedStyle(stage).height, 10);
  buffer.height = stage.height = height;
  let width = (3 / 4) * height;
  stage.style.width = (buffer.width = stage.width = width) + "px";

  let timeout;

  window.addEventListener("resize", () => {
    if (timeout == undefined) {
      timeout = setTimeout(() => {
        timeout = undefined;
        height = parseInt(window.getComputedStyle(stage).height, 10);
        buffer.height = stage.height = height;
        width = (3 / 4) * height;
        stage.style.width = (buffer.width = stage.width = width) + "px";
      }, 10);
    }
  });

  return (cb: Callback): Callback => {
    return (event: Object) => {
      cb(event);
      cb(new Event({
        ctx: bufferCtx,
        width: width,
        height: height,
      }));
      stageCtx.drawImage(buffer, 0, 0);
    };
  };
}

export class Event extends Immutable.Record({
  ctx: undefined,
  width: 0,
  height: 0,
}) {
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
}
