import "../spec-config.ts";

import * as sinon from "sinon";
import { expect } from "chai";

import IO from "../../src/engine/io";

describe("IO", function() {
  describe("#bind", function() {
    it("should callback with mapped value", function() {
      let mockImpl = sinon.spy();
      let mockGet = sinon.spy();
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let mockMap = sinon.stub();
      let fixture = new IO<string>(mockImpl);
      let fixture2 = new IO<string>(null);
      sinon.stub(fixture2, "run");

      fixture.bind(mockMap).run(mockGet, mockSet, mockCb);
      mockMap.returns(fixture2);
      mockImpl.callArgWith(2, "input-value");

      expect(mockImpl).to.have.been.calledWith(mockGet, mockSet, sinon.match.func);
      expect(mockGet).not.to.have.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).not.to.have.been.called;
      expect(mockMap).to.have.been.calledWithExactly("input-value");
      expect(fixture2.run).to.have.been.calledWithExactly(mockGet, mockSet, mockCb);
    });
  });

  describe("#map", function() {
    it("should callback with mapped value", function() {
      let mockImpl = sinon.spy();
      let mockGet = sinon.spy();
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let mockMap = sinon.stub();
      let fixture = new IO<string>(mockImpl);

      fixture.map(mockMap).run(mockGet, mockSet, mockCb);
      mockMap.returns("output-value");
      mockImpl.callArgWith(2, "input-value");

      expect(mockImpl).to.have.been.calledWith(mockGet, mockSet, sinon.match.func);
      expect(mockGet).not.to.have.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockMap).to.have.been.calledWithExactly("input-value");
      expect(mockCb).to.have.been.calledWithExactly("output-value");
    });
  });

  describe("#run", function() {
    it("should call implemenation", function() {
      let mockImpl = sinon.spy();
      let mockGet = sinon.spy();
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let fixture = new IO<string>(mockImpl);

      fixture.run(mockGet, mockSet, mockCb);

      expect(mockImpl).to.have.been.calledWithExactly(mockGet, mockSet, mockCb);
      expect(mockGet).not.to.have.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).not.to.have.been.called;
    });
  });

  describe(".Put", function() {
    it("should update state", function() {
      let mockGet = sinon.spy();
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let fixture = IO.Put<string>("put-value");

      fixture.run(mockGet, mockSet, mockCb);

      expect(mockGet).not.to.have.been.called;
      expect(mockSet).to.have.been.calledWithExactly("put-value");
      expect(mockCb).to.have.been.calledWithExactly("put-value");
    });
  });

  describe(".Get", function() {
    it("should return state", function() {
      let mockGet = sinon.mock()
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let fixture = IO.Get<string>();
      mockGet.returns("get-value");

      fixture.run(mockGet, mockSet, mockCb);

      expect(mockGet).to.been.calledWithExactly();
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).to.have.been.calledWithExactly("get-value");
    });
  });

  describe(".Delay", function() {
    let clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it("should return state", function() {
      let mockGet = sinon.mock()
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let fixture = IO.Delay<string>(5000);
      mockGet.returns("get-value");

      fixture.run(mockGet, mockSet, mockCb);

      expect(mockGet).not.to.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).not.to.have.been.called;

      clock.tick(4999);

      expect(mockGet).not.to.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).not.to.have.been.called;

      clock.tick(1);

      expect(mockGet).to.been.calledWithExactly();
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).to.have.been.calledWithExactly("get-value");
    });
  });

  describe(".All", function() {
    it("should call implemenation", function() {
      let mockGet = sinon.spy();
      let mockSet = sinon.spy();
      let mockCb = sinon.spy();
      let fixture1 = new IO<string>(null);
      sinon.stub(fixture1, "run");
      let fixture2 = new IO<string>(null);
      sinon.stub(fixture2, "run");
      let fixture3 = new IO<string>(null);
      sinon.stub(fixture3, "run");
      let fixture = IO.All<string>([ fixture1, fixture2, fixture3 ]);

      fixture.run(mockGet, mockSet, mockCb);

      expect(fixture1.run)
        .to.have.been.calledWithExactly(mockGet, mockSet, sinon.match.func);
      expect(fixture2.run)
        .to.have.been.calledWithExactly(mockGet, mockSet, sinon.match.func);
      expect(fixture3.run)
        .to.have.been.calledWithExactly(mockGet, mockSet, sinon.match.func);
      expect(mockGet).not.to.have.been.called;
      expect(mockSet).not.to.have.been.called;
      expect(mockCb).not.to.have.been.called;

      (<any> fixture1.run).callArgWith(2, "value-1");

      expect(mockCb).not.to.have.been.called;

      (<any> fixture2.run).callArgWith(2, "value-2");

      expect(mockCb).not.to.have.been.called;

      (<any> fixture3.run).callArgWith(2, "value-3");

      expect(mockCb).to.have.been.calledWithExactly("value-3");
    });
  });
});
