"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require("immutable");
var io_1 = require("./io");
var MetaComponent = (function (_super) {
    __extends(MetaComponent, _super);
    function MetaComponent() {
        _super.apply(this, arguments);
    }
    return MetaComponent;
}(Immutable.Record({ id: 0 })));
exports.MetaComponent = MetaComponent;
var Engine = (function (_super) {
    __extends(Engine, _super);
    function Engine() {
        _super.apply(this, arguments);
    }
    Engine.prototype.mkEntity = function (entity) {
        var newId = (this.id + 1).toString();
        var newEntity = entity.set("meta", new MetaComponent({ id: newId }));
        return this.setIn(["entities", newId], newEntity)
            .set("id", Number(newId));
    };
    ;
    Engine.prototype.upEntity = function (entity) {
        var id = entity.getIn(["meta", "id"]);
        return this.setIn(["entities", id], entity);
    };
    ;
    Engine.prototype.patchEntity = function (entity, patch) {
        var normed = Immutable.fromJS(patch).delete("meta");
        return this.upEntity(this.rdEntity(entity).mergeDeep(normed));
    };
    Engine.prototype.rmEntity = function (entity) {
        var id;
        if ((typeof entity === "number") || (typeof entity === "string")) {
            id = entity;
        }
        else {
            id = entity.getIn(["meta", "id"]);
        }
        return this.deleteIn(["entities", id.toString()]);
    };
    ;
    Engine.prototype.rdEntity = function (entity) {
        var id;
        if ((typeof entity === "number") || (typeof entity === "string")) {
            id = entity;
        }
        else {
            id = entity.getIn(["meta", "id"]);
        }
        return this.entities.get(id.toString());
    };
    Engine.prototype.lastEntity = function () {
        return this.entities.get(this.id.toString());
    };
    Engine.prototype.lastId = function () {
        return this.id;
    };
    Engine.prototype.pushState = function (state) {
        return this.set("state", this.state.push(state));
    };
    ;
    Engine.prototype.popState = function () {
        return this.set("state", this.state.pop());
    };
    ;
    Engine.prototype.run = function (event) {
        return this.runSystem(this.state.peek(), event);
    };
    ;
    Engine.prototype.runSystem = function (system, event) {
        return system(this, event);
    };
    ;
    Engine.prototype.runIterator = function (filters, iterator) {
        return this.runIteratorOn(filters, iterator, this);
    };
    Engine.prototype.runIteratorOn = function (filters, iterator, initial) {
        return this.entities.filter(function (e) {
            return filters.every(function (f) { return e.get(f) != undefined; });
        }).reduce(iterator, initial);
    };
    ;
    Engine.prototype.runIOIterator = function (filters, iterator) {
        return io_1["default"].All(this.entities.filter(function (e) {
            return filters.every(function (f) { return e.get(f) != undefined; });
        }).map(iterator).toArray());
    };
    ;
    return Engine;
}(Immutable.Record({
    entities: Immutable.Map(),
    state: Immutable.Stack(),
    id: 0
})));
exports.__esModule = true;
exports["default"] = Engine;
