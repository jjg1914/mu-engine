function normalizeKey(ev) {
  return ev.keyCode;
}

export default function Input(canvas, cb) {
  canvas.setAttribute("tabindex", "1");

  canvas.addEventListener("keydown", (ev) => {
    if (!ev.repeat) {
      cb({ type: "keydown", which: normalizeKey(ev) });
    }
  });

  canvas.addEventListener("keyup", (ev) => {
    cb({ type: "keyup", which: normalizeKey(ev) });
  });
}

export const Keys = {
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  SPACE: 32,
}
