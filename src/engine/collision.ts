import * as Immutable from "immutable";
import Engine, { Entity } from "./engine";
import Polygon, { vec2, Bounds } from "./polygon";

export default function Collision(engine: Engine,
                                  width: number,
                                  height: number): Node {
  return engine.runIteratorOn([ "position" ], (root: Node, entity: Entity) => {
    return addEntity(root, entity);
  }, new Node({ bottom: height, right: width }));
}

export function query(tree: Node,
                      entity: Entity): Immutable.Map<string, Entity> {
  if (tree.children) {
    return tree.children.reduce((memo: Immutable.Map<string, Entity>,
                                 node: Node) => {
      if (checkBounds(node, entity)) {
        return memo.merge(query(node, entity));
      } else {
        return memo;
      }
    }, Immutable.Map<string, Entity>());
  } else {
    return tree.entities.reduce((memo: Immutable.Map<string, Entity>,
                                 value: Entity) => {
      if (entity.getIn([ "meta", "id" ]) !== value.getIn([ "meta", "id" ])
          && checkBounds(value, entity) && checkMasks(value, entity)) {
        return memo.set(value.getIn([ "meta", "id" ]), value);
      } else {
        return memo;
      }
    }, Immutable.Map<string, Entity>());
  }
}

function addEntity(node: Node, entity: Entity, depth: number = 0): Node {
  if (depth < 8 && node.children == undefined && node.entities.size > 4) {
    node = rebalanceNode(node);
  }

  if (node.children) {
    return <Node> node.set("children", node.children.map((e: Node) => {
      return addEntity(e, entity, depth + 1);
    }));
  } else {
    if (checkBounds(node, entity)) {
      return <Node> node.set("entities", node.entities.push(entity));
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
      return checkBounds(newNode, f);
    }));
  }));
}

function checkBounds(value: Node | Entity, entity: Entity): boolean {
  let entityBounds = getBounds(entity);
  let valueBounds = (value instanceof Node) ? value : getBounds(value);

  return entityBounds.left <= valueBounds.right
      && entityBounds.right >= valueBounds.left
      && entityBounds.top <= valueBounds.bottom
      && entityBounds.bottom >= valueBounds.top;
}

function checkMasks(value: Entity, entity: Entity): boolean {
  if (value.getIn([ "position", "mask" ]) == undefined
      && entity.getIn([ "position", "mask" ]) == undefined) {
    return true;
  } else {
    let mask1 = getMasks(entity);
    let mask2 = getMasks(value);

    let normals1 = mask1.normals();
    let normals2 = mask2.normals();

    return normals1.every((e: vec2): boolean => {
      let proj1 = mask1.project(e);
      let proj2 = mask2.project(e);

      return proj1[0] <= proj2[1] && proj1[1] >= proj2[0];
    }) && normals2.every((e: vec2): boolean => {
      let proj1 = mask1.project(e);
      let proj2 = mask2.project(e);

      return proj1[0] <= proj2[1] && proj1[1] >= proj2[0];
    });
  }
}

function getBounds(entity: Entity): Bounds {
  let left = entity.getIn([ "position", "x" ]);
  let top = entity.getIn([ "position", "y" ]);

  return {
    left: left,
    right: left + entity.getIn([ "position", "width" ]),
    top: top,
    bottom: top + entity.getIn([ "position", "height" ]),
  };
}

function getMasks(entity: Entity): Polygon {
  let mask = entity.getIn([ "position", "mask" ]);

  if (mask instanceof Polygon) {
    let x = Number(entity.getIn([ "position", "x" ]));
    let y = Number(entity.getIn([ "position", "y" ]));

    return mask.translate(x, y);
  } else {
    let x = Number(entity.getIn([ "position", "x" ]));
    let y = Number(entity.getIn([ "position", "y" ]));
    let width = Number(entity.getIn([ "position", "width" ]));
    let height = Number(entity.getIn([ "position", "height" ]));

    return new Polygon([
      [ x, y ],
      [ x + width, y ],
      [ x + width, y + height ],
      [ x, y + height ],
    ]);
  }
}

class Node extends Immutable.Record({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  entities: Immutable.List<Entity>(),
  children: undefined,
}) implements Bounds {
  public top: number;
  public bottom: number;
  public left: number;
  public right: number;
  public children: Immutable.List<Node>;
  public entities: Immutable.List<Entity>;
}