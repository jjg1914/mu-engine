"use strict";
function search(path, t) {
    var i;
    for (i = path.length - 1; i >= 0; --i) {
        if (path[i].t <= t) {
            break;
        }
    }
    return [path[i], path[i + 1]];
}
function Path(entity, path) {
    var norms = path.reduce(function (m, v) {
        var last = (m.length > 0) ? m[m.length - 1] : {
            t: 0,
            x: entity.getIn(["position", "x"]),
            y: entity.getIn(["position", "y"])
        };
        var _a = [v.x || 0, v.y || 0], x = _a[0], y = _a[1];
        if (!v.absolute) {
            x += last.x;
            y += last.y;
        }
        return m.concat([{
                t: last.t + v.t,
                x: x,
                y: y,
                dx: v.dx,
                dy: v.dy,
                linear: v.linear
            }]);
    }, []);
    return function (t) {
        var _a = search(norms, t), start = _a[0], end = _a[1];
        if (end != undefined) {
            var nt = (t - start.t) / (end.t - start.t);
            if (end.linear) {
                var dx = end.x - start.x;
                var dy = end.y - start.y;
                return [(dx * nt) + start.x, (dy * nt) + start.y];
            }
            else {
                var h00 = (2 * nt * nt * nt) - (3 * nt * nt) + 1;
                var h10 = (nt * nt * nt) - (2 * nt * nt) + nt;
                var h01 = (-2 * nt * nt * nt) + (3 * nt * nt);
                var h11 = (nt * nt * nt) - (nt * nt);
                var x = h00 * start.x + h10 * start.dx
                    + h01 * end.x + h11 * end.dx;
                var y = h00 * start.y + h10 * start.dy
                    + h01 * end.y + h11 * end.dy;
                return [x, y];
            }
        }
        else {
            return [start.x, start.y];
        }
    };
}
exports.__esModule = true;
exports["default"] = Path;
