"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require("immutable");
var shape_1 = require("./shape");
function Collision(engine, width, height) {
    return engine.runIteratorOn(["position"], function (root, entity) {
        return addEntity(root, entity, shape_1.maskFor(entity).bounds());
    }, new Node({ bottom: height, right: width }));
}
exports.__esModule = true;
exports["default"] = Collision;
function addEntity(node, entity, bounds, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth < 8 && node.children == undefined && node.entities.size > 4) {
        node = rebalanceNode(node);
    }
    if (node.children) {
        return node.set("children", node.children.map(function (e) {
            return addEntity(e, entity, bounds, depth + 1);
        }));
    }
    else {
        if (checkBounds(node, bounds)) {
            return node.set("entities", node.entities.push([bounds, entity]));
        }
        else {
            return node;
        }
    }
}
function rebalanceNode(node) {
    var height = (node.bottom - node.top) / 2;
    var width = (node.right - node.left) / 2;
    return node.set("children", [0, 1, 2, 3].map(function (e) {
        var x = Math.floor(e / 2);
        var y = e % 2;
        var newNode = new Node({
            top: node.top + y * height,
            left: node.left + x * width,
            // tslint:disable-next-line:no-bitwise
            bottom: node.bottom - (y ^ 1) * height,
            // tslint:disable-next-line:no-bitwise
            right: node.right - (x ^ 1) * width
        });
        return newNode.set("entities", node.entities.filter(function (f) {
            return checkBounds(newNode, f[0]);
        }));
    }));
}
function checkBounds(value, entity) {
    return entity.left <= value.right
        && entity.right >= value.left
        && entity.top <= value.bottom
        && entity.bottom >= value.top;
}
function checkMasks(mask1, mask2) {
    var normals = getNormals(mask1, mask2);
    return normals.every(function (e) {
        var proj1 = mask1.project(e);
        var proj2 = mask2.project(e);
        return proj1[0] <= proj2[1] && proj1[1] >= proj2[0];
    });
}
function getNormals(shape1, shape2) {
    var normals1;
    var normals2;
    if (shape1 instanceof shape_1.Polygon) {
        normals1 = shape1.normals();
    }
    else if (shape1 instanceof shape_1.Circle) {
        normals1 = shape1.normals(shape2);
    }
    if (shape2 instanceof shape_1.Polygon) {
        normals2 = shape2.normals();
    }
    else if (shape2 instanceof shape_1.Circle) {
        normals2 = shape2.normals(shape1);
    }
    return normals1.concat(normals2).map(function (e) {
        var mag = Math.sqrt((e[0] * e[0]) + e[1] * e[1]);
        return [e[0] / mag, e[1] / mag];
    }).toList();
}
function hasNPhase(entity) {
    return (entity.getIn(["position", "mask"]) instanceof shape_1.Polygon)
        || (entity.getIn(["position", "mask"]) instanceof shape_1.Circle);
}
var Node = (function (_super) {
    __extends(Node, _super);
    function Node() {
        _super.apply(this, arguments);
    }
    Node.prototype.query = function (entity, bounds) {
        var hasNPhase1 = hasNPhase(entity);
        var mask1 = shape_1.maskFor(entity);
        bounds = bounds || mask1.bounds();
        if (this.children) {
            return this.children.reduce(function (memo, node) {
                if (checkBounds(node, bounds)) {
                    return memo.merge(node.query(entity));
                }
                else {
                    return memo;
                }
            }, Immutable.Map());
        }
        else {
            return this.entities.reduce(function (memo, value) {
                var hasNPhase2 = hasNPhase(value[1]);
                var narrowPhase = hasNPhase1 || hasNPhase2;
                if (entity.getIn(["meta", "id"]) !== value[1].getIn(["meta", "id"])
                    && checkBounds(value[0], bounds)
                    && (!narrowPhase || checkMasks(mask1, shape_1.maskFor(value[1])))) {
                    return memo.set(value[1].getIn(["meta", "id"]), value[1]);
                }
                else {
                    return memo;
                }
            }, Immutable.Map());
        }
    };
    return Node;
}(Immutable.Record({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    entities: Immutable.List(),
    children: undefined
})));
exports.Node = Node;
