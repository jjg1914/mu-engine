export default function Path(path, t, x, y, repeat) {
  if (repeat) {
    t = t % _total(path);
  }

  const [ start, end ] = _search(path, t, x, y);

  if (end != null) {
    let nt = (t - start._t) / end.t;

    if (end.linear) {
      return _linear(end.t / 1000, nt, start, end);
    } else {
      return _hermite(end.t / 1000, nt, start, end);
    }
  } else {
    return [ start.x, start.y ];
  }
}

function _total(path) {
  let accum = 0;
  
  for (let e of path) {
    accum += e.t;
  }

  return accum;
}

function _search(path, t, x, y) {
  let accum = 0;
  let start = null;

  if (path.length > 0 && path[0].t > 0) {
    start = {
      t: 0,
      _t: 0,
      x: x,
      y: y,
      dx: 0,
      dy: 0,
    };
  }

  for (let e of path) {
    accum += e.t;

    const end = {
      t: e.t,
      _t: accum,
      x: (e.x || 0) + (e.absolute ? 0 : (start != null ? start.x : x)),
      y: (e.y || 0) + (e.absolute ? 0 : (start != null ? start.y : y)),
      dx: e.dx,
      dy: e.dy,
      linear: e.linear,
    }

    if (accum > t) {
      return [ start, end ];
    } else {
      start = end;
    }
  }

  return [ start, null ];
}

function _linear(dt, nt, start, end) {
  return [
    (end.x - start.x) * nt + start.x,
    (end.y - start.y) * nt + start.y,
  ];
}

function _hermite(dt, nt, start, end) {
  const h00 = (2 * nt * nt * nt) - (3 * nt * nt) + 1;
  const h10 = (nt * nt * nt) - (2 * nt * nt) + nt;
  const h01 = (-2 * nt * nt * nt) + (3 * nt * nt);
  const h11 = (nt * nt * nt) - (nt * nt);

  const x = h00 * start.x + h10 * start.dx
            + h01 * end.x + h11 * end.dx;
  const y = h00 * start.y + h10 * start.dy
            + h01 * end.y + h11 * end.dy;

  return [ x, y ];
}
