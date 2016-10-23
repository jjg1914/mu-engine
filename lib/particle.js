"use strict";
require("./poly");
var render_1 = require("./render");
var interval_1 = require("./interval");
var shape_1 = require("./shape");
var Property;
(function (Property) {
    Property[Property["EXPIRE"] = 0] = "EXPIRE";
    Property[Property["X"] = 1] = "X";
    Property[Property["Y"] = 2] = "Y";
    Property[Property["STROKE"] = 3] = "STROKE";
    Property[Property["FILL"] = 4] = "FILL";
    Property[Property["COUNT"] = 5] = "COUNT";
})(Property || (Property = {}));
var circle = (new shape_1.Circle(1)).path();
function Particle() {
    var particles = [];
    var colors = [];
    var colorIndex = {};
    var count = 0;
    return function (cb) {
        return function (event) {
            var tmp = cb(event);
            if (event instanceof interval_1.Event) {
                tmp.runIterator(["position", "emitter"], function (engine, entity) {
                    if (checkDuty(event.t, event.dt, entity)) {
                        var stroke = calcColor(entity, "stroke", colors, colorIndex);
                        var fill = calcColor(entity, "fill", colors, colorIndex);
                        var emitCount = entity.getIn(["emitter", "count"]);
                        var lifetime = entity.getIn(["emitter", "lifetime"]);
                        for (var i = 0; i < emitCount; ++i) {
                            count = create(event.t, count, particles, calcPos(entity, "x", "nudgeX"), calcPos(entity, "y", "nudgeY"), lifetime, stroke, fill);
                        }
                    }
                    return engine;
                });
                count = recycle(event.t, particles, count);
            }
            else if (event instanceof render_1.Event) {
                draw(event.ctx, particles, count, colors);
            }
            return tmp;
        };
    };
}
exports.__esModule = true;
exports["default"] = Particle;
function checkDuty(t, dt, entity) {
    var f = 1000 / entity.getIn(["emitter", "frequency"]);
    var t1 = t % f;
    var t0 = (t - dt) % f;
    return t1 < t0;
}
function create(t, count, particles, x, y, lifetime, stroke, fill) {
    var index = count * Property.COUNT;
    count += 1;
    if (particles.length < count * Property.COUNT) {
        particles.length += Property.COUNT;
    }
    particles[index + Property.EXPIRE] = t + lifetime;
    particles[index + Property.X] = x;
    particles[index + Property.Y] = y;
    particles[index + Property.STROKE] = stroke;
    particles[index + Property.FILL] = fill;
    return count;
}
function recycle(t, particles, count) {
    for (var i = 0; i < count; ++i) {
        var index = i * Property.COUNT;
        while (particles[index + Property.EXPIRE] < t) {
            count -= 1;
            if (i < count) {
                particles.copyWithin(index, Property.COUNT * count, Property.COUNT * (count + 1));
            }
            else {
                break;
            }
        }
    }
    return count;
}
function draw(ctx, particles, count, colors) {
    for (var i = 0; i < count; ++i) {
        var index = i * Property.COUNT;
        ctx.save();
        ctx.translate(particles[index + Property.X], particles[index + Property.Y]);
        if (particles[index + Property.FILL]) {
            ctx.fillStyle = colors[particles[index + Property.FILL]];
            ctx.fill(circle);
        }
        if (particles[index + Property.STROKE]) {
            ctx.strokeStyle = colors[particles[index + Property.STROKE]];
            ctx.stroke(circle);
        }
        ctx.restore();
    }
}
function calcColor(entity, field, colors, colorIndex) {
    var c = entity.getIn(["emitter", field]);
    if (c) {
        if (!colorIndex[c]) {
            colorIndex[c] = colors.length;
            colors.push(c);
        }
        return colorIndex[c];
    }
    else {
        return -1;
    }
}
function calcPos(entity, field, nudgeField) {
    var pos = entity.getIn(["position", field]);
    var nudge = entity.getIn(["emitter", nudgeField]);
    if (nudge !== 0) {
        return pos + (2 * Math.random() * nudge) - nudge;
    }
    else {
        return pos;
    }
}
