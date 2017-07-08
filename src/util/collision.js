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
        let vectors = _checkImpl(mask,
                                 _hasNPhase(e[0]) ? shapeFor(e[0]) : null,
                                 bounds, e[1]);

        if (vectors)  {
          dest.set(e[0].meta.id, { entity: e[0], vectorData: vectors });
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
  let vectors = _checkBounds(targetBounds, otherBounds);

  if (vectors && (target != null || other != null)) {
    vectors = _checkMasks(target, other, targetBounds, otherBounds);
  }

  if (vectors)  {
    return vectors;
  } else {
    return false;
  }
}

function _checkBounds(a, b) {
  if (a.left <= b.right && a.right >= b.left &&
      a.top <= b.bottom && a.bottom >= b.top) {
    return [
      [ b.left - a.right - 1, 0 ],
      [ b.right - a.left + 1, 0 ],
      [ 0, b.top - a.bottom - 1 ],
      [ 0, b.bottom - a.top  + 1 ],
    ];
  } else {
    return false;
  }
}

function _checkMasks(a, b, aBounds, bBounds) {
  if (a == null) {
    a = fromBounds(aBounds);
  }

  if (b == null) {
    b = fromBounds(bBounds);
  }

  const normals = a.normals(b).concat(b.normals(a));
  for (let e of normals) {
    const mag = Math.sqrt(e[0] * e[0] + e[1] * e[1]);
    e[0] = e[0] / mag;
    e[1] = e[1] / mag;
  }

  const vectors = new Array(normals.length);

  for (let i = 0; i < normals.length; ++i) {
    const e = normals[i];
    const proj1 = a.project(e);
    const proj2 = b.project(e);

    if (proj1[0] <= proj2[1] && proj1[1] >= proj2[0]) {
      const d1 = proj2[0] - proj1[1];
      const d2 = proj2[1] - proj1[0];

      if (Math.abs(d1) < Math.abs(d2)) {
        vectors[i] = e.map((e) => e * d1);
      } else {
        vectors[i] = e.map((e) => e * d2);
      }
    } else {
      return false;
    }
  }

  return vectors;
}

function _hasNPhase(entity) {
  return (entity.position.mask instanceof Polygon)
         || (entity.position.mask instanceof Circle);
}
