import { Polygon, Circle, shapeFor, fromBounds } from "../util/shape";

const DEPTH_LIMIT = 8;

export default class Collision {
  constructor(bounds) {
    this._root = {
      top: bounds.top,
      left: bounds.left,
      bottom: bounds.bottom,
      right: bounds.right,
      entities: [],
    };
  }

  static checkBounds(target, bounds) {
    return _checkBounds(shapeFor(target).bounds(), bounds);
  }

  static check(target, other) {
    let mask1 = shapeFor(target);
    let mask2 = shapeFor(other);

    return _checkImpl(_hasNPhase(target) ? mask1 : null,
                      _hasNPhase(other) ? mask2: null,
                      mask1.bounds(), mask2.bounds());
  }

  add(entity) {
    _add(entity, this._root, shapeFor(entity).bounds(), 0);
  }

  queryBounds(bounds, id) {
    const mask = fromBounds(bounds);
    const dest = new Map();
    const rval = [];

    _query(dest, id, this._root,
           bounds, null, false);

    for (let e of dest) {
      if (e[1]) {
        rval.push(e[1]);
      }
    }

    return rval;
  }

  query(entity) {
    const mask = shapeFor(entity);
    const dest = new Map();
    const rval = [];

    _query(dest, entity.meta.id, this._root,
           mask.bounds(), _hasNPhase(entity) ? mask : null);

    for (let e of dest) {
      if (e[1]) {
        rval.push(e[1]);
      }
    }

    return rval;
  }
}

function _add(entity, node, bounds, depth) {
  if (depth < DEPTH_LIMIT &&
      node.children == null &&
      node.entities.length > 4) {
    _rebalanceNode(node);
  }

  if (node.children) {
    for (let n of node.children) {
      _add(entity, n, bounds, depth + 1);
    }
  } else {
    if (_checkBounds(node, bounds)) {
      node.entities.push([ entity, bounds ]);
    }
  }
}

function _query(dest, id, node, bounds, mask) {
  if (node.children != null) {
    for (let e of node.children) {
      if (_checkBounds(bounds, e)) {
        _query(dest, id, e, bounds, mask);
      }
    }
  } else {
    for (let e of node.entities) {
      if (e[0].meta.id != id && !dest.has(e[0].meta.id)) {
        let mtv = _checkImpl(mask,
                             _hasNPhase(e[0]) ? _shapeFor(e[0]) : null,
                             bounds, e[1]);

        if (mtv)  {
          dest.set(e[0].meta.id, { entity: e[0], mtv: mtv });
        } else {
          dest.set(e[0].meta.id, false);
        }
      }
    }
  }
}

function _rebalanceNode(node) {
  const width = (node.right - node.left) / 2;
  const height = (node.bottom - node.top) / 2;

  node.children = new Array(4);

  for (let i = 0; i < 4; i += 1) {
    const x = Math.floor(i / 2);
    const y = i % 2;

    node.children[i] = {
      top: node.top + y * height,
      left: node.left + x * width,
      bottom: node.bottom - (y ^ 1) * height,
      right: node.right - (x ^ 1) * width,
      entities: [],
    };

    for (let e of node.entities) {
      if (_checkBounds(node.children[i], e[1])) {
        node.children[i].entities.push(e);
      }
    }
  }
}

function _checkImpl(target, other, targetBounds, otherBounds) {
  let mtv = _checkBounds(targetBounds, otherBounds);

  if (mtv && target != null && other != null) {
    mtv = _checkMasks(target, other);
  }

  if (mtv)  {
    return mtv;
  } else {
    return false;
  }
}

function _checkBounds(a, b) {
  if (a.left <= b.right && a.right >= b.left &&
      a.top <= b.bottom && a.bottom >= b.top) {
    const vectors = [
      [ a.left - b.right, 0 ],
      [ a.right - b.left, 0 ],
      [ 0, a.top - b.bottom ],
      [ 0, a.bottom - b.top ],
    ];

    let mtv = null;
    let d = Infinity;

    for (let e of vectors) {
      let f = Math.abs(e[0] + e[1]);

      if (f < d) {
        mtv = e;
        d = f;
      }
    }

    return mtv;
  } else {
    return false;
  }
}

function _checkMasks(a, b) {
  const normals = a.normals(b).concat(b.normals(a));
  let mtv = null;
  let overlap = Infinity;

  for (let e of normals) {
    const proj1 = a.project(e);
    const proj2 = b.project(e);

    if (proj1[0] <= proj2[1] && proj1[1] >= proj2[0]) {
      return false;
    } else {
      const d = Math.min(proj1[1], proj2[1]) - Math.max(proj1[0], proj2[0]);

      if (d < overlap) {
        mtv = e;
        overlap = d;
      }
    }
  }

  return mtv;
}

function _hasNPhase(entity) {
  return (entity.position.mask instanceof Polygon)
         || (entity.position.mask instanceof Circle);
}
