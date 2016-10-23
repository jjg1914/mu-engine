"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require("./poly");
var immutable_1 = require("immutable");
function maskFor(entity) {
    var mask = entity.getIn(["position", "mask"]);
    if (!(mask instanceof Polygon || mask instanceof Circle)) {
        var width = Number(entity.getIn(["position", "width"]));
        var height = Number(entity.getIn(["position", "height"]));
        mask = new Polygon([
            [0, 0],
            [width, 0],
            [width, height],
            [0, height],
        ]);
    }
    var x = Number(entity.getIn(["position", "x"]));
    var y = Number(entity.getIn(["position", "y"]));
    var rotate = Number(entity.getIn(["position", "rotate"]));
    return mask.rotate(rotate).translate(x, y);
}
exports.maskFor = maskFor;
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(radius) {
        _super.call(this, { radius: radius, x: radius, y: radius });
    }
    Circle.prototype.translate = function (x, y) {
        return this.set("x", this.x + x).set("y", this.y + y);
    };
    Circle.prototype.rotate = function (_r) {
        return this;
    };
    Circle.prototype.normals = function (other) {
        var _this = this;
        if (other instanceof Circle) {
            var x = other.x - this.x;
            var y = other.y - this.y;
            return immutable_1.List([[x, y]]);
        }
        else if (other instanceof Polygon) {
            var vertex = other.verticies.map(function (e) {
                var x = e[0] - _this.x;
                var y = e[1] - _this.y;
                return [[x, y], Math.sqrt(x * x + y * y)];
            }).reduce(function (m, v) {
                return (v[1] < m[1]) ? v : m;
            });
            return immutable_1.List([vertex[0]]);
        }
        else {
            throw new Error("unsupported shape");
        }
    };
    Circle.prototype.project = function (axis) {
        var dot = axis[0] * this.x + axis[1] * this.y;
        return [dot - this.radius, dot + this.radius];
    };
    Circle.prototype.dimensions = function () {
        return {
            width: this.radius * 2,
            height: this.radius * 2
        };
    };
    Circle.prototype.bounds = function () {
        return {
            left: this.x - this.radius,
            right: this.x + this.radius,
            top: this.y - this.radius,
            bottom: this.y + this.radius
        };
    };
    Circle.prototype.path = function () {
        var path = new Path2D();
        path.moveTo(this.x + this.radius, this.y);
        path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        return path;
    };
    return Circle;
}(immutable_1.Record({
    radius: 0,
    x: 0,
    y: 0
})));
exports.Circle = Circle;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(verticies) {
        if (verticies instanceof Array) {
            _super.call(this, { verticies: immutable_1.List(verticies) });
        }
        else {
            _super.call(this, { verticies: verticies });
        }
    }
    Polygon.prototype.translate = function (x, y) {
        return new Polygon(this.verticies.map(function (e) {
            return [e[0] + x, e[1] + y];
        }).toList());
    };
    Polygon.prototype.rotate = function (r) {
        var dim = this.dimensions();
        var x = dim.width / 2;
        var y = dim.height / 2;
        var c = Math.cos(r);
        var s = Math.sin(r);
        var const1 = -c * x + s * y + x;
        var const2 = -s * x - c * y + y;
        return new Polygon(this.verticies.map(function (e) {
            return [
                c * e[0] - s * e[1] + const1,
                s * e[0] + c * e[1] + const2,
            ];
        }).toList());
    };
    Polygon.prototype.normals = function () {
        var prev = this.verticies.last();
        return this.verticies.map(function (e) {
            var normal = [e[1] - prev[1], prev[0] - e[0]];
            prev = e;
            return normal;
        }).toList();
    };
    Polygon.prototype.project = function (axis) {
        return this.verticies.reduce(function (m, v) {
            var dot = axis[0] * v[0] + axis[1] * v[1];
            return [Math.min(dot, m[0]), Math.max(dot, m[1])];
        }, [Infinity, -Infinity]);
    };
    Polygon.prototype.dimensions = function () {
        var bounds = this.bounds();
        return {
            width: bounds.right - bounds.left,
            height: bounds.bottom - bounds.top
        };
    };
    Polygon.prototype.bounds = function () {
        var left = Infinity;
        var right = -Infinity;
        var top = Infinity;
        var bottom = -Infinity;
        this.verticies.forEach(function (e) {
            left = Math.min(e[0], left);
            right = Math.max(e[0], right);
            top = Math.min(e[1], top);
            bottom = Math.max(e[1], bottom);
        });
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    };
    Polygon.prototype.path = function () {
        var path = new Path2D();
        var last = this.verticies.last();
        path.moveTo(last[0], last[1]);
        this.verticies.forEach(function (e) {
            path.lineTo(e[0], e[1]);
        });
        return path;
    };
    return Polygon;
}(immutable_1.Record({
    verticies: immutable_1.List()
})));
exports.Polygon = Polygon;
