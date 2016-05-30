import * as Immutable from "immutable";
import Engine, { Entity } from "./engine";
import { vec2, Bounds, Shape, Polygon, Circle } from "./shape";

export default function Collision(engine: Engine,
                                  width: number,
                                  height: number): Node {
  return engine.runIteratorOn([ "position" ], (root: Node, entity: Entity) => {
    return addEntity(root, entity, getMasks(entity).bounds());
  }, new Node({ bottom: height, right: width }));
}

export function query(tree: Node,
                      entity: Entity,
                      bounds?: Bounds): Immutable.Map<string, Entity> {
  let hasNPhase1 = hasNPhase(entity);
  let mask1 = getMasks(entity);
  bounds = bounds || mask1.bounds();

  if (tree.children) {
    return tree.children.reduce((memo: Immutable.Map<string, Entity>,
                                 node: Node) => {
      if (checkBounds(node, bounds)) {
        return memo.merge(query(node, entity));
      } else {
        return memo;
      }
    }, Immutable.Map<string, Entity>());
  } else {
    return tree.entities.reduce((memo: Immutable.Map<string, Entity>,
                                 value: [ Bounds, Entity ]) => {
      let hasNPhase2 = hasNPhase(value[1]);
      let narrowPhase = hasNPhase1 || hasNPhase2;

      if (entity.getIn([ "meta", "id" ]) !== value[1].getIn([ "meta", "id" ])
          && checkBounds(value[0], bounds)
          && (!narrowPhase || checkMasks(mask1, getMasks(value[1])))) {
        return memo.set(value[1].getIn([ "meta", "id" ]), value[1]);
      } else {
        return memo;
      }
    }, Immutable.Map<string, Entity>());
  }
}

function addEntity(node: Node,
                   entity: Entity,
                   bounds: Bounds,
                   depth: number = 0): Node {
  if (depth < 8 && node.children == undefined && node.entities.size > 4) {
    node = rebalanceNode(node);
  }

  if (node.children) {
    return <Node> node.set("children", node.children.map((e: Node) => {
      return addEntity(e, entity, bounds, depth + 1);
    }));
  } else {
    if (checkBounds(node, bounds)) {
      return <Node> node.set("entities", node.entities.push([ bounds, entity ]));
    } else {
      return node;
    }
  }
}

function rebalanceNode(node: Node): Node {
  let height = (node.bottom - node.top) / 2;
  let width = (node.right - node.left) / 2;

  return <Node> node.set("children", [ 0, 1, 2, 3 ].map((e) => {
    let x = Math.floor(e / 2);
    let y = e % 2;

    let newNode = new Node({
      top: node.top + y * height,
      left: node.left + x * width,
      // tslint:disable-next-line:no-bitwise
      bottom: node.bottom - (y ^ 1) * height,
      // tslint:disable-next-line:no-bitwise
      right: node.right - (x ^ 1) * width,
    });

    return newNode.set("entities", node.entities.filter((f) => {
      return checkBounds(newNode, f[0]);
    }));
  }));
}

function checkBounds(value: Bounds, entity: Bounds): boolean {
  return entity.left <= value.right
      && entity.right >= value.left
      && entity.top <= value.bottom
      && entity.bottom >= value.top;
}

function checkMasks(mask1: Shape, mask2: Shape): boolean {
  let normals = getNormals(mask1, mask2);

  return normals.every((e: vec2): boolean => {
    let proj1 = mask1.project(e);
    let proj2 = mask2.project(e);

    return proj1[0] <= proj2[1] && proj1[1] >= proj2[0];
  });
}

function getNormals(shape1: Shape, shape2: Shape): Immutable.List<vec2> {
  let normals1;
  let normals2;

  if (shape1 instanceof Polygon) {
    normals1 = shape1.normals();
  } else if (shape1 instanceof Circle) {
    normals1 = shape1.normals(shape2);
  }

  if (shape2 instanceof Polygon) {
    normals2 = shape2.normals();
  } else if (shape2 instanceof Circle) {
    normals2 = shape2.normals(shape1);
  }

  return normals1.concat(normals2).map((e: vec2): vec2 => {
    let mag = Math.sqrt((e[0] * e[0]) + e[1] * e[1]);

    return [ e[0] / mag, e[1] / mag ];
  }).toList();
}

function getMasks(entity: Entity): Shape {
  let mask = entity.getIn([ "position", "mask" ]);

  if (mask instanceof Polygon || mask instanceof Circle) {
    let x = Number(entity.getIn([ "position", "x" ]));
    let y = Number(entity.getIn([ "position", "y" ]));
    let rotate = Number(entity.getIn([ "position", "rotate" ]));

    return mask.translate(x, y);
  } else {
    let x = Number(entity.getIn([ "position", "x" ]));
    let y = Number(entity.getIn([ "position", "y" ]));
    let width = Number(entity.getIn([ "position", "width" ]));
    let height = Number(entity.getIn([ "position", "height" ]));
    let rotate = Number(entity.getIn([ "position", "rotate" ]));

    return new Polygon([
      [ 0, 0 ],
      [ width, 0 ],
      [ width, height ],
      [ 0, height ],
    ]).rotate(rotate).translate(x, y);
  }
}

function hasNPhase(entity: Entity): boolean {
  return (entity.getIn([ "position", "mask"]) instanceof Polygon)
         || (entity.getIn([ "position", "mask"]) instanceof Circle);
}

class Node extends Immutable.Record({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  entities: Immutable.List<[ Bounds, Entity ]>(),
  children: undefined,
}) implements Bounds {
  public top: number;
  public bottom: number;
  public left: number;
  public right: number;
  public children: Immutable.List<Node>;
  public entities: Immutable.List<[ Bounds, Entity ]>;
}
