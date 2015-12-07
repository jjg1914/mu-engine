///<reference path="../node_modules/immutable/dist/immutable.d.ts"/>
///<reference path="../typings/mocha/mocha.d.ts" />
///<reference path="../typings/chai/chai.d.ts" />
///<reference path="../typings/sinon/sinon.d.ts" />
///<reference path="./spec.d.ts" />

import Immutable = require("immutable");
import chai = require("chai");
import sinon = require("sinon");
import Mu = require("../src/index");

import chaiImmutable = require("chai-immutable");

let expect = chai.expect;

chai.use(chaiImmutable);

describe("Mu", function() {
  describe(".Engine", function() {
    it("should create default engine", function() {
      expect(Mu.Engine()).to.equal(Immutable.fromJS({}));
    });
  });

  describe(".mkEntity", function() {
    beforeEach(function() {
      this.subject = Immutable.Map<number, Mu.Entity>();
    });

    it("should add entity", function() {
      var mock = sinon.mock(Math)
      mock.expects("random")
        .once()
        .withExactArgs()
        .returns(0.333);

      expect(Mu.mkEntity(this.subject, Immutable.Map<string,Immutable.Map<string, any>>({ comp: Immutable.Map<string, any>({ foo: "bar" }) })))
        .to.equal(Immutable.Map().set(357556027, Immutable.fromJS({
          comp: { foo: "bar" },
          meta: new Mu.MetaComponent({ id: 357556027 }),
        })));
      mock.verify();
    });

    it("should not duplicate id", function() {
      var mock = sinon.mock(Math)
      mock.expects("random")
        .once()
        .withExactArgs()
        .returns(0.333);
      mock.expects("random")
        .once()
        .withExactArgs()
        .returns(0.111);
      this.subject = this.subject.set(357556027 , Immutable.fromJS({
        meta: new Mu.MetaComponent({ id: 357556027 }),
      }));

      expect(Mu.mkEntity(this.subject, Immutable.Map<string,Immutable.Map<string, any>>({ comp: Immutable.Map<string, any>({ foo: "bar" }) })))
        .to.equal(Immutable.Map().set(357556027, Immutable.fromJS({
          meta: new Mu.MetaComponent({ id: 357556027 }),
        })).set(119185342, Immutable.fromJS({
          comp: { foo: "bar" },
          meta: new Mu.MetaComponent({ id: 119185342 }),
        })));
      mock.verify();
    });
  });

  describe(".upEntity", function() {
    beforeEach(function() {
      this.entity = Immutable.fromJS({
        meta: new Mu.MetaComponent({ id: 123 }),
        comp: { foo: "bar" },
      });
      this.subject = Immutable.Map<number, Mu.Entity>().set(123, this.entity);
    });

    it("should remove entity", function() {
      expect(Mu.upEntity(this.subject, this.entity.setIn([ "comp", "foo" ], "baz")))
        .to.equal(Immutable.Map().set(123, Immutable.fromJS({
          meta: new Mu.MetaComponent({ id: 123}),
          comp: { foo: "baz" },
        })));
    });
  });

  describe(".rmEntity", function() {
    beforeEach(function() {
      this.entity = Immutable.fromJS({
        meta: new Mu.MetaComponent({ id: 123 }),
      });
      this.subject = Immutable.Map<number, Mu.Entity>().set(123, this.entity);
    });

    it("should remove entity", function() {
      expect(Mu.rmEntity(this.subject, this.entity))
        .to.equal(Immutable.Map<number, Mu.Entity>());
    });
  });

  describe(".runSystem", function() {
    beforeEach(function() {
      this.subject = Immutable.Map<number, Mu.Entity>()
        .set(1, Immutable.fromJS({
          meta: new Mu.MetaComponent({ id: 1 }),
          comp1: { foo: 1 },
          comp2: { bar: 1 },
        })).set(2, Immutable.fromJS({
          meta: new Mu.MetaComponent({ id: 2 }),
          comp2: { bar: 2 },
          comp3: { fizz: 2 },
        })).set(3, Immutable.fromJS({
          meta: new Mu.MetaComponent({ id: 3 }),
          comp1: { foo: 3 },
          comp2: { bar: 3 },
          comp3: { fizz: 3 },
        }));
    });

    it("should run system for each matching entity", function() {
      var engine1 = this.subject;
      var mock1 = sinon.expectation.create("mock")
        .once()
        .withExactArgs(engine1, this.subject.get(1));

      var engine2 = this.subject.set(1, this.subject.get(1).set("foo", 1));
      var mock3 = sinon.expectation.create("mock")
        .once()
        .withExactArgs(engine2, this.subject.get(3));

      var engine3 = this.subject.set(3, this.subject.get(3).set("foo", 3));
      var mockOther = sinon.expectation.create("mock").never();

      expect(Mu.runSystem(this.subject, Immutable.List<string>([ "comp1", "comp2" ]), function(engine: Mu.Engine, entity: Mu.Entity): Mu.Engine {
        switch (entity.get("meta").get("id")) {
        case 1:
          mock1(engine, entity);
          return engine2;
        case 3:
          mock3(engine, entity);
          return engine3;
        default:
          mockOther();
        }
      })).to.equal(engine3);
      mock1.verify();
      mock3.verify();
      mockOther.verify();
    });
  });
});
