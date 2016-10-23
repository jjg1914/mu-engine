"use strict";
var IO = (function () {
    function IO(f) {
        this._f = f;
    }
    IO.Wrap = function (t) {
        if (t instanceof IO) {
            return t;
        }
        else {
            return new IO(function (_get, _set, cb) {
                cb(t);
            });
        }
    };
    IO.Thread = function (funcs) {
        return funcs.reduce(function (memo, value) {
            return memo.bind(function (t) { return IO.Wrap(value(t)); });
        }, IO.Wrap(undefined));
    };
    IO.Put = function (t) {
        return new IO(function (_get, set, cb) {
            set(t);
            cb(t);
        });
    };
    IO.Get = function () {
        return new IO(function (get, _set, cb) {
            cb(get());
        });
    };
    IO.Delay = function (n) {
        return new IO(function (get, _set, cb) {
            setTimeout(function () { return cb(get()); }, n);
        });
    };
    IO.All = function (ios) {
        return new IO(function (get, set, cb) {
            var counter = 0;
            for (var _i = 0, ios_1 = ios; _i < ios_1.length; _i++) {
                var io = ios_1[_i];
                io.run(get, set, function (t) {
                    if (++counter === ios.length) {
                        cb(t);
                    }
                });
            }
        });
    };
    IO.Noop = function () {
        return IO.Get();
    };
    IO.prototype.bind = function (f) {
        var _this = this;
        return new IO(function (get, set, cb) {
            _this._f(get, set, function (t) { return f(t).run(get, set, cb); });
        });
    };
    IO.prototype.map = function (f) {
        var _this = this;
        return new IO(function (get, set, cb) {
            _this._f(get, set, function (t) { return cb(f(t)); });
        });
    };
    IO.prototype.run = function (get, set, cb) {
        this._f(get, set, cb);
    };
    return IO;
}());
exports.__esModule = true;
exports["default"] = IO;
