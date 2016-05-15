import "../spec-config.ts";

import * as sinon from "sinon";
import { expect } from "chai";
import * as Immutable from "immutable";

import Engine from "../../src/engine/engine";

describe("Engine", function() {
  describe("#mkEntity", function() {
    it("should add entity", function() {
      let subject = new Engine();
      let fixture = Immutable.fromJS({ foo: "bar" });

      expect(subject.mkEntity(fixture)).to.equal(Immutable.fromJS({
        entities: { 1: { foo: "bar", meta: { id: "1" } } },
        state: [],
        id: 1,
      }));
    });
  });

  describe("#upEntity", function() {
    it("should update entity", function() {
      let subject = new Engine(Immutable.fromJS({
        entities: { 1: { foo: "bar", meta: { id: "1" } } },
        state: [],
        id: 1,
      }));
      let fixture = Immutable.fromJS({ foo: "new-var", meta: { id: "1" } });

      expect(subject.upEntity(fixture)).to.equal(Immutable.fromJS({
        entities: { 1: { foo: "new-var", meta: { id: "1" } } },
        state: [],
        id: 1,
      }));
    });
  });

  describe("#rmEntity", function() {
    it("should remove entity", function() {
      let subject = new Engine(Immutable.fromJS({
        entities: { 1: { foo: "bar", meta: { id: "1" } } },
        state: [],
        id: 1,
      }));
      let fixture = Immutable.fromJS({ foo: "new-var", meta: { id: "1" } });

      expect(subject.rmEntity(fixture)).to.equal(Immutable.fromJS({
        entities: {},
        state: [],
        id: 1,
      }));
    });
  });

  describe("#pushState", function() {
    it("should push state", function() {
      let subject = new Engine();
      let fixture = sinon.spy();

      expect(subject.pushState(fixture)).to.equal(Immutable.fromJS({
        entities: {},
        state: [ fixture ],
        id: 0,
      }));
    });
  });

  describe("#popState", function() {
    it("should pop state", function() {
      let subject = new Engine(Immutable.fromJS({
        entities: {},
        state: [ sinon.spy() ],
        id: 0,
      }));

      expect(subject.popState()).to.equal(Immutable.fromJS({
        entities: {},
        state: [],
        id: 0,
      }));
    });
  });

  describe("#run", function() {
    it("should run top state", function() {
      let subject = new Engine(Immutable.fromJS({
        entities: {},
        state: Immutable.Stack([ "a", "b", "c" ]),
        id: 0,
      }));
      sinon.stub(subject, "runSystem").returns("return-value");

      expect(subject.run("event-value")).to.equal("return-value");
      expect(subject.runSystem)
        .to.have.been.calledWithExactly("a", "event-value");
    });
  });

  describe("#runSystem", function() {
    it("should run system", function() {
      let subject = new Engine();
      let spy = sinon.stub()
        .withArgs(subject, "event-value")
        .returns("return-value");

      expect(subject.runSystem(spy, "event-value")).to.equal("return-value");
    });
  });

  describe("#runIterator", function() {
    it("should run iterator", function() {
      let subject = new Engine();
      let spy = sinon.spy();
      sinon.stub(subject, "runIteratorOn")
        .withArgs([ "a", "b", "c" ], spy, subject)
        .returns("return-value");

      expect(subject.runIterator([ "a", "b", "c" ], spy))
        .to.equal("return-value");
      expect(spy).not.to.have.been.called;
    });
  });

  describe("#runIteratorOn", function() {
    it("should run iterator on value", function() {
      let subject = new Engine(Immutable.fromJS({
        entities: { 
          1: { meta: { id: "1" }, comp1: "v1", comp2: "v2" },
          2: { meta: { id: "2" }, comp1: "v3", comp3: "v4" },
          3: { meta: { id: "3" }, comp1: "v5", comp2: "v6", comp3: "v7" },
        },
        state: [],
        id: 1,
      }));

      let stub = sinon.stub();
      stub.withArgs("value-1", Immutable.fromJS({
        meta: { id: "1" },
        comp1: "v1",
        comp2: "v2",
      })).returns("value-2");
      stub.withArgs("value-2", Immutable.fromJS({
        meta: { id: "3" },
        comp1: "v5",
        comp2: "v6",
        comp3: "v7",
      })).returns("value-3")

      expect(subject.runIteratorOn([ "comp1", "comp2" ], stub, "value-1"))
        .to.equal("value-3");
    });
  });
});
