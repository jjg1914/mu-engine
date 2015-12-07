var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../node_modules/immutable/dist/immutable.d.ts"/>
var Immutable = require("immutable");
var Mu;
(function (Mu) {
    var MetaComponent = (function (_super) {
        __extends(MetaComponent, _super);
        function MetaComponent() {
            _super.apply(this, arguments);
        }
        return MetaComponent;
    })(Immutable.Record({ id: 123 }));
    Mu.MetaComponent = MetaComponent;
    function Engine() {
        return Immutable.Map();
    }
    Mu.Engine = Engine;
    function mkEntity(engine, entity) {
        var id;
        do {
            id = Math.floor(Math.random() * 1024 * 1024 * 1024);
        } while (engine.has(id));
        entity = entity.set("meta", new MetaComponent({ id: id }));
        return engine.set(entity.get("meta").get("id"), entity);
    }
    Mu.mkEntity = mkEntity;
    function upEntity(engine, entity) {
        return engine.set(entity.get("meta").get("id"), entity);
    }
    Mu.upEntity = upEntity;
    function rmEntity(engine, entity) {
        return engine.remove(entity.get("meta").get("id"));
    }
    Mu.rmEntity = rmEntity;
    function runSystem(engine, filters, system) {
        return engine.reduce(function (m, v) {
            if (filters.every(function (s) { return v.has(s); })) {
                return system(m, v);
            }
            else {
                return m;
            }
        }, engine);
    }
    Mu.runSystem = runSystem;
})(Mu || (Mu = {}));
module.exports = Mu;
