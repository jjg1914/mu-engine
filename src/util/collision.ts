import { PositionEntity } from "../util/shape";

import {
  Polygon,
  Circle,
  Shape,
  Bounds,
  shapeFor,
} from "./shape";

const DEPTH_LIMIT = 8;

export type Vector = [ number, number ];

export interface CollisionEntity extends PositionEntity {
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate?: number;
    mask?: Shape | null;
    solid?: boolean | number[];
    ignoreSolid?: boolean;
    landing: CollisionEntity | null;
  };
  movement?: {
    xChange: number;
    yChange: number;
    xSpeed: number;
    ySpeed: number;
    xSubpixel: number;
    ySubpixel: number;
    friction: number | null;
    nogravity: boolean;
  };
}

interface Node extends Bounds {
  entities: ([ CollisionEntity, Bounds ])[];
  children?: Node[] | null;
}

export interface QueryData {
  entity: CollisionEntity;
  vectorData: Vector[];
}

export class Collision {
  private _root: Node;
  private _entities: Map<number, CollisionEntity>;

  constructor(bounds: Bounds) {
    this._root = {
      top: bounds.top,
      left: bounds.left,
      bottom: bounds.bottom,
      right: bounds.right,
      entities: [],
    };
    this._entities = new Map<number, CollisionEntity>();
  }

  static checkBounds(target: CollisionEntity, bounds: Bounds) {
    return _checkBounds(shapeFor(target).bounds(), bounds);
  }

  static check(target: CollisionEntity, other: CollisionEntity) {
    let mask1 = shapeFor(target);
    let mask2 = shapeFor(other);

    return _checkImpl(_hasNPhase(target) ? mask1 : null,
                      _hasNPhase(other) ? mask2: null,
                      mask1.bounds(), mask2.bounds());
  }

  [Symbol.iterator]() {
    return this._entities.values();
  }

  bounds(): Bounds {
    return {
      top: this._root.top,
      left: this._root.left,
      bottom: this._root.bottom,
      right: this._root.right,
    };
  }

  add(entity: CollisionEntity): boolean {
    const rval = _add(entity, this._root, shapeFor(entity).bounds(), 0);

    this._entities.set(entity.id, entity);

    return rval;
  }

  queryBounds(bounds: Bounds, id: number) {
    const dest = new Map();
    const rval = [];

    _query(dest, id, this._root, bounds, null);

    for (let e of dest) {
      if (e[1]) {
        rval.push(e[1]);
      }
    }

    return rval;
  }

  query(entity: CollisionEntity): QueryData[] {
    const mask = shapeFor(entity);
    const dest = new Map();
    const rval = [];

    _query(dest, entity.id, this._root,
           mask.bounds(), _hasNPhase(entity) ? mask : null);

    for (let e of dest) {
      if (e[1]) {
        rval.push(e[1]);
      }
    }

    return rval;
  }
}

function _add(entity: CollisionEntity,
              node: Node,
              bounds: Bounds,
              depth: number): boolean {
  if (depth < DEPTH_LIMIT &&
      node.children == null &&
      node.entities.length > 4) {
    _rebalanceNode(node);
  }

  if (node.children) {
    let rval = false;

    for (let n of node.children) {
      rval = _add(entity, n, bounds, depth + 1) || rval;
    }

    return rval;
  } else {
    if (_checkBounds(node, bounds)) {
      node.entities.push([ entity, bounds ] as [ CollisionEntity, Bounds ]);

      return true;
    } else {
      return false;
    }
  }
}

function _query(dest: Map<number, QueryData | false>,
                id: number, node: Node,
                bounds: Bounds, mask: Shape | null): void {
  if (node.children != null) {
    for (let e of node.children) {
      if (_checkBounds(bounds, e)) {
        _query(dest, id, e, bounds, mask);
      }
    }
  } else {
    for (let e of node.entities) {
      if (e[0].id != id && !dest.has(e[0].id)) {
        let vectors = _checkImpl(mask,
                                 _hasNPhase(e[0]) ? shapeFor(e[0]) : null,
                                 bounds, e[1]);

        if (vectors)  {
          dest.set(e[0].id, { entity: e[0], vectorData: vectors });
        } else {
          dest.set(e[0].id, false);
        }
      }
    }
  }
}

function _rebalanceNode(node: Node): void {
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

function _checkImpl(target: Shape | null, other: Shape | null,
                    targetBounds: Bounds, otherBounds: Bounds)
: Vector[] | false {
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

function _checkBounds(a: Bounds, b: Bounds): Vector[] | false {
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

function _checkMasks(a: Shape | null, b: Shape | null,
                     aBounds: Bounds, bBounds: Bounds)
: Vector[] | false {
  if (a == null) {
    a = Polygon.fromBounds(aBounds);
  }

  if (b == null) {
    b = Polygon.fromBounds(bBounds);
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

function _hasNPhase(entity: CollisionEntity): boolean {
  return (entity.position.mask instanceof Polygon)
         || (entity.position.mask instanceof Circle);
}
