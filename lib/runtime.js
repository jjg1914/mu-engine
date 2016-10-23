"use strict";
var io_1 = require("./io");
function Runtime(initial, f) {
    var state = {
        state: undefined
    };
    if (initial instanceof io_1["default"]) {
        initial.run(function () { return state.state; }, function (t) { return state.state = t; }, function (t) { return state.state = t; });
    }
    else {
        state.state = initial;
    }
    f(function (event) {
        if (event instanceof Error) {
            console.error(event);
        }
        else {
            var temp = state.state.run(event);
            if (temp instanceof io_1["default"]) {
                temp.run(function () { return state.state; }, function (t) { return state.state = t; }, function (t) { return state.state = t; });
            }
            else {
                state.state = temp;
            }
        }
        return state.state;
    });
    return state;
}
exports.__esModule = true;
exports["default"] = Runtime;
