export default function Render(canvas, config = {}) {
  if (typeof canvas.getContext !== "function") {
    throw new Error("Canvas not supported");
  }

  const buffer = document.createElement("canvas");
  const stageCtx = canvas.getContext("2d");
  const bufferCtx = buffer.getContext("2d");

  let [ height, width ] = resize(canvas, buffer, config);

  let timeout;

  window.addEventListener("resize", () => {
    if (timeout == undefined) {
      timeout = setTimeout(() => {
        timeout = undefined;
        [ height, width ] = resize(canvas, buffer, config);
      }, 10);
    }
  });

  return (cb) => {
    return (event) => {
      cb(event);
      cb({ type: "render", ctx: bufferCtx, width: width, height: height });
      stageCtx.drawImage(buffer, 0, 0);
    };
  };
}

function resize(canvas, buffer, config) {
  const stageCtx = stage.getContext("2d");
  const bufferCtx = buffer.getContext("2d");
  let scale = 1;
  let height;
  let width;

  if (config.scale != null) {
    scale = config.scale;
  }

  if (config.height != null) {
    stage.style.height = ((height = config.height) * scale) + "px";
    stage.height = (buffer.height = height) * scale;
  } else {
    height = parseInt(window.getComputedStyle(stage).height, 10);
    buffer.height = Math.floor((stage.height = height) / scale);
  }

  if (config.width != null) {
    stage.style.width = ((width = config.width) * scale) + "px";
    stage.width = (buffer.width = width) * scale;
  } else {
    stage.style.width = (width = (3 / 4) * height) + "px";
    buffer.width = Math.floor((stage.width = width) / scale);
  }

  if (config.smoothing != null) {
    stageCtx.mozImageSmoothingEnabled = config.smoothing;
    stageCtx.imageSmoothingEnabled = config.smoothing;
  }

  if (config.scale != null) {
    stageCtx.scale(config.scale, config.scale);
  }

  // bufferCtx.translate(0.5, 0.5);

  return [ height, width ];
}
