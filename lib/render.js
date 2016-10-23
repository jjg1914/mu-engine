"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require("./poly");
var Immutable = require("immutable");
function Render(stage, config) {
    if (config === void 0) { config = {}; }
    if (typeof stage.getContext !== "function") {
        throw new Error("Canvas not supported");
    }
    var buffer = document.createElement("canvas");
    var stageCtx = stage.getContext("2d");
    var bufferCtx = buffer.getContext("2d");
    var _a = resize(stage, buffer, config), height = _a[0], width = _a[1];
    var timeout;
    window.addEventListener("resize", function () {
        if (timeout == undefined) {
            timeout = setTimeout(function () {
                timeout = undefined;
                _a = resize(stage, buffer, config), height = _a[0], width = _a[1];
                var _a;
            }, 10);
        }
    });
    return function (cb) {
        return function (event) {
            cb(event);
            var tmp = cb(new Event({
                ctx: bufferCtx,
                width: width,
                height: height
            }));
            stageCtx.drawImage(buffer, 0, 0);
            return tmp;
        };
    };
}
exports.__esModule = true;
exports["default"] = Render;
var Event = (function (_super) {
    __extends(Event, _super);
    function Event() {
        _super.apply(this, arguments);
    }
    return Event;
}(Immutable.Record({
    ctx: undefined,
    width: 0,
    height: 0
})));
exports.Event = Event;
function resize(stage, buffer, config) {
    var height;
    var width;
    var stageCtx = stage.getContext("2d");
    var bufferCtx = buffer.getContext("2d");
    var scale = 1;
    if (typeof config.scale === "number") {
        scale = config.scale;
    }
    if (typeof config.height === "number") {
        stage.style.height = ((height = config.height) * scale) + "px";
        stage.height = (buffer.height = height) * scale;
    }
    else {
        height = parseInt(window.getComputedStyle(stage).height, 10);
        buffer.height = Math.floor((stage.height = height) / scale);
    }
    if (typeof config.width === "number") {
        stage.style.width = ((width = config.width) * scale) + "px";
        stage.width = (buffer.width = width) * scale;
    }
    else {
        stage.style.width = (width = (3 / 4) * height) + "px";
        buffer.width = Math.floor((stage.width = width) / scale);
    }
    if (typeof config.smoothing === "boolean") {
        stageCtx.mozImageSmoothingEnabled = config.smoothing;
        stageCtx.imageSmoothingEnabled = config.smoothing;
    }
    if (typeof config.scale === "number") {
        stageCtx.scale(config.scale, config.scale);
    }
    bufferCtx.translate(0.5, 0.5);
    return [height, width];
}
