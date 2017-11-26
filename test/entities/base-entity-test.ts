import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";

import { BaseEntity } from "../../src/entities/base-entity";

describe("BaseEntity", function() {
  beforeEach(function() {
    this.entity = new BaseEntity();
  })

  describe("#constructor", function() {
    it("should assign id", function() {
      expect(this.entity.id).to.be.a("number");
    });

    it("should assign subsequent id", function() {
      const entity2 = new BaseEntity();
      expect(entity2.id - this.entity.id).to.equal(1);
    });

    it("should not assign parent", function() {
      expect(this.entity.parent).to.be.undefined;
    });
  });

  describe("#send", function() {
    describe("inactive", function() {
      it("should return false by default", function() {
        expect(this.entity.send("foo", "data")).to.be.false;
      });

      it("should return false when not short circuited", function() {
        const stub = sinon.stub();
        stub.returns(false)
        this.entity.on("foo", stub);
        
        expect(this.entity.send("foo", "data")).to.be.false;
      });

      it("should return true when short circuited", function() {
        const stub = sinon.stub();
        stub.returns(true)
        this.entity.on("foo", stub);
        
        expect(this.entity.send("foo", "data")).to.be.true;
      })

      it("should support nested calls", function() {
        const stub = sinon.stub();
        stub.callsFake(() => { this.entity.send("bar", "data2"); });
        this.entity.on("foo", stub);
        const spy = sinon.spy();
        this.entity.on("bar", spy);

        this.entity.send("foo", "data");
        expect(spy).to.have.been.calledWith("data2");
      });
    });

    describe("inactive", function() {
      beforeEach(function() {
        this.entity.setActive(false);
      });

      it("should return false", function() {
        const stub = sinon.stub();
        stub.returns(true)
        this.entity.on("foo", stub);
        
        expect(this.entity.send("foo", "data")).to.be.false;
      });

      it("should not invoke handler", function() {
        const stub = sinon.stub();
        stub.returns(true)
        this.entity.on("foo", stub);
        
        this.entity.send("foo", "data");
        expect(stub).not.to.have.been.called;
      });
    });
  });

  describe("#around", function() {
    it("should invoke each handler in order", function() {
      const stub1 = sinon.stub();
      stub1.callsArg(0);
      this.entity.around("foo", stub1);
      const stub2 = sinon.stub();
      stub2.callsArg(0);
      this.entity.around("foo", stub2);
      const stub3 = sinon.stub();
      stub3.callsArg(0);
      this.entity.around("foo", stub3);

      this.entity.send("foo", "foo");
      sinon.assert.callOrder(stub3.withArgs(sinon.match.func, "foo"),
                             stub2.withArgs(sinon.match.func, "foo"),
                             stub1.withArgs(sinon.match.func, "foo"));
    });

    it("should short circuit without callback", function() {
      const stub1 = sinon.stub();
      stub1.callsArg(0);
      this.entity.around("foo", stub1);
      const stub2 = sinon.stub();
      this.entity.around("foo", stub2);
      const stub3 = sinon.stub();
      stub3.callsArg(0);
      this.entity.around("foo", stub3);

      this.entity.send("foo", "foo");
      expect(stub1).not.to.have.been.called;
    });
  });

  describe("#before", function() {
    it("should invoke each handler in order", function() {
      const spy1 = sinon.spy();
      this.entity.before("foo", spy1);
      const spy2 = sinon.spy();
      this.entity.before("foo", spy2);
      const spy3 = sinon.spy();
      this.entity.before("foo", spy3);

      this.entity.send("foo", "foo");
      sinon.assert.callOrder(spy3.withArgs("foo"),
                             spy2.withArgs("foo"),
                             spy1.withArgs("foo"));
    });

    it("should short circuit on true", function() {
      const spy1 = sinon.spy();
      this.entity.before("foo", spy1);
      const stub = sinon.stub();
      stub.returns(true);
      this.entity.before("foo", stub);
      const spy2 = sinon.spy();
      this.entity.before("foo", spy2);

      this.entity.send("foo", "foo");
      expect(spy1).not.to.have.been.called;
    });
  });

  describe("#after", function() {
    it("should invoke each handler in order", function() {
      const spy1 = sinon.spy();
      this.entity.after("foo", spy1);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);
      const spy3 = sinon.spy();
      this.entity.on("foo", spy3);

      this.entity.send("foo", "foo");
      sinon.assert.callOrder(spy2.withArgs("foo"),
                             spy3.withArgs("foo"),
                             spy1.withArgs("foo"));
    });

    it("should short circuit on true", function() {
      const spy1 = sinon.spy();
      this.entity.after("foo", spy1);
      const stub = sinon.stub();
      stub.returns(true);
      this.entity.on("foo", stub);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);

      this.entity.send("foo", "foo");
      expect(spy1).not.to.have.been.called;
    });
  });

  describe("#on", function() {
    it("should invoke handler", function() {
      const mock = sinon.mock();
      mock.once().withArgs("payload-value")
      this.entity.on("foo", mock);

      this.entity.send("foo", "payload-value");
      mock.verify();
    });

    it("should invoke each handler in order", function() {
      const spy1 = sinon.spy();
      this.entity.on("foo", spy1);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);
      const spy3 = sinon.spy();
      this.entity.on("foo", spy3);

      this.entity.send("foo", "foo");
      sinon.assert.callOrder(spy1.withArgs("foo"),
                             spy2.withArgs("foo"),
                             spy3.withArgs("foo"));
    });

    it("should short circuit on true", function() {
      const spy1 = sinon.spy();
      this.entity.on("foo", spy1);
      const stub = sinon.stub();
      stub.returns(true);
      this.entity.on("foo", stub);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);

      this.entity.send("foo", "foo");
      expect(spy2).not.to.have.been.called;
    });
  });

  describe("#last", function() {
    it("should invoke handler", function() {
      const mock = sinon.mock();
      mock.once().withArgs("foo", "payload-value")
      this.entity.last(mock);

      this.entity.send("foo", "payload-value");
      mock.verify();
    });

    it("should invoke each handler in order", function() {
      const spy1 = sinon.spy();
      this.entity.last(spy1);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);
      const spy3 = sinon.spy();
      this.entity.on("foo", spy3);
      const spy4 = sinon.spy();
      this.entity.last(spy4);

      this.entity.send("foo", "data");
      sinon.assert.callOrder(spy2.withArgs("data"),
                             spy3.withArgs("data"),
                             spy1.withArgs("foo", "data"),
                             spy4.withArgs("foo", "data"));
    });

    it("should short circuit on true", function() {
      const spy1 = sinon.spy();
      this.entity.last(spy1);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);
      const stub = sinon.stub();
      stub.returns(true);
      this.entity.on("foo", stub);

      this.entity.send("foo", "data");
      expect(spy1).not.to.have.been.called;
    });

    it("should short circuit last on true", function() {
      const spy1 = sinon.spy();
      this.entity.last(spy1);
      const spy2 = sinon.spy();
      this.entity.on("foo", spy2);
      const stub = sinon.stub();
      stub.returns(true);
      this.entity.last(stub);
      const spy3 = sinon.spy();
      this.entity.last(spy3);

      this.entity.send("foo", "data");
      expect(spy3).not.to.have.been.called;
    });
  });

  describe("#activate", function() {
    it("should set active to true", function () {
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
      this.entity.activate();
      expect(this.entity.isActive()).to.be.true;
    });

    it("should not reset active", function () {
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
      this.entity.activate();
      expect(this.entity.isActive()).to.be.true;
    });
  });

  describe("#deactivate", function() {
    it("should set active to false", function () {
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
      this.entity.deactivate();
      expect(this.entity.isActive()).to.be.false;
    });

    it("should not reset active", function () {
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
      this.entity.deactivate();
      expect(this.entity.isActive()).to.be.false;
    });
  });

  describe("#toggle", function() {
    it("should set active to true", function () {
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
      this.entity.toggle();
      expect(this.entity.isActive()).to.be.true;
    });

    it("should set active to false", function () {
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
      this.entity.toggle();
      expect(this.entity.isActive()).to.be.false;
    });
  });

  describe("#setActive", function() {
    it("should set active to true", function () {
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
    });

    it("should set active to false", function () {
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
    });
  });

  describe("#isActive", function() {
    it("should be true", function () {
      this.entity.setActive(false);
      expect(this.entity.isActive()).to.be.false;
    });

    it("should be false", function () {
      this.entity.setActive(true);
      expect(this.entity.isActive()).to.be.true;
    });
  });

  describe("#isInactive", function() {
    it("should be true", function () {
      this.entity.setActive(false);
      expect(this.entity.isInactive()).to.be.true;
    });

    it("should be false", function () {
      this.entity.setActive(true);
      expect(this.entity.isInactive()).to.be.false;
    });
  });
});
