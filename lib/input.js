"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require("immutable");
function normalizeKey(ev) {
    return ev.keyCode;
}
function Input(stage, cb) {
    stage.setAttribute("tabindex", "1");
    stage.addEventListener("keydown", function (ev) {
        if (!ev.repeat) {
            cb(new Event({
                type: EventType.KEY_DOWN,
                which: normalizeKey(ev)
            }));
        }
    });
    stage.addEventListener("keyup", function (ev) {
        cb(new Event({
            type: EventType.KEY_UP,
            which: normalizeKey(ev)
        }));
    });
}
exports.__esModule = true;
exports["default"] = Input;
(function (EventType) {
    EventType[EventType["UNKNOWN"] = 0] = "UNKNOWN";
    EventType[EventType["KEY_DOWN"] = 1] = "KEY_DOWN";
    EventType[EventType["KEY_UP"] = 2] = "KEY_UP";
})(exports.EventType || (exports.EventType = {}));
var EventType = exports.EventType;
(function (Keys) {
    Keys[Keys["ARROW_LEFT"] = 37] = "ARROW_LEFT";
    Keys[Keys["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
    Keys[Keys["ARROW_UP"] = 38] = "ARROW_UP";
    Keys[Keys["ARROW_DOWN"] = 40] = "ARROW_DOWN";
    Keys[Keys["SPACE"] = 32] = "SPACE";
})(exports.Keys || (exports.Keys = {}));
var Keys = exports.Keys;
var Event = (function (_super) {
    __extends(Event, _super);
    function Event() {
        _super.apply(this, arguments);
    }
    return Event;
}(Immutable.Record({
    type: EventType.UNKNOWN,
    which: ""
})));
exports.Event = Event;
