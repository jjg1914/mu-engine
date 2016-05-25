import * as Immutable from "immutable";

import { Callback } from "./runtime";

export type Renderer = (_cb: Callback) => Callback;

interface Config {
  width?: number;
  height?: number;
  scale?: number;
  smoothing?: boolean;
}

export default function Render(stage: HTMLCanvasElement,
                               config: Config = {}): Renderer {
  if (typeof stage.getContext !== "function") {
    throw new Error("Canvas not supported");
  }

  let buffer = <HTMLCanvasElement> document.createElement("canvas");
  let stageCtx = stage.getContext("2d");
  let bufferCtx = buffer.getContext("2d");

  let [ height, width ] = resize(stage, buffer, config);

  let timeout;

  window.addEventListener("resize", () => {
    if (timeout == undefined) {
      timeout = setTimeout(() => {
        timeout = undefined;
        [ height, width ] = resize(stage, buffer, config);
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

function resize(stage: HTMLCanvasElement,
                buffer: HTMLCanvasElement,
                config: Config): [ number, number ] {
  let height;
  let width;
  let stageCtx = stage.getContext("2d");
  let bufferCtx = buffer.getContext("2d");
  let scale = 1;

  if (typeof config.scale === "number") {
    scale = config.scale;
  }

  if (typeof config.height === "number") {
    stage.style.height = ((height = config.height) * scale) + "px";
    stage.height = (buffer.height = height) * scale;
  } else {
    height = parseInt(window.getComputedStyle(stage).height, 10);
    buffer.height = Math.floor((stage.height = height) / scale);
  }

  if (typeof config.width === "number") {
    stage.style.width = ((width = config.width) * scale) + "px";
    stage.width = (buffer.width = width) * scale;
  } else {
    stage.style.width = (width = (3 / 4) * height) + "px";
    buffer.width = Math.floor((stage.width = width) / scale);
  }

  if (typeof config.smoothing === "boolean") {
    stageCtx.mozImageSmoothingEnabled = config.smoothing;
    stageCtx.imageSmoothingEnabled = config.smoothing;
  }

  if (typeof config.scale === "number") {
    stageCtx.scale(config.scale, config.scale);
  }

  bufferCtx.translate(0.5, 0.5);

  return [ height, width ];
}
