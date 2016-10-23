"use strict";
var io_1 = require("./io");
function Timeline(timeline) {
    return io_1["default"].All(timeline.reduce(function (m, v) {
        var last = (m.length > 0) ? m[m.length - 1][0] : 0;
        return m.concat([[last + v[0], v[1]]]);
    }, []).map(function (e) {
        return io_1["default"].Delay(e[0]).bind(e[1]);
    }));
}
exports.__esModule = true;
exports["default"] = Timeline;
