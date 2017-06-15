const Now = (() => {
  if (Performance.now != null) {
    return () => Performance.now();
  } else {
    return () => Date.now();
  }
})();

export default function(fps, cb) {
  const start = Now();
  let last = start;

  const interval = setInterval(() => {
    const now = Now();

    try {
      cb({ type: "interval", t: now - start, dt: now - last });
    } catch (e) {
      clearInterval(interval);
      throw e;
    }

    last = now;
  }, 1000 / fps);
}
