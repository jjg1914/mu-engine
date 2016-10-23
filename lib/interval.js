"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require("immutable");
function Interval(rate, cb) {
    var start = performance.now();
    var now = start;
    var last = start;
    var interval = setInterval(function () {
        try {
            last = now;
            now = performance.now();
            cb(new Event({ t: now - start, dt: now - last }));
        }
        catch (err) {
            clearInterval(interval);
            cb(err);
        }
    }, 1000 / rate);
}
exports.__esModule = true;
exports["default"] = Interval;
;
var Event = (function (_super) {
    __extends(Event, _super);
    function Event() {
        _super.apply(this, arguments);
    }
    return Event;
}(Immutable.Record({
    t: 0,
    dt: 0
})));
exports.Event = Event;
