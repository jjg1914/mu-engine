import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";

import { BaseEntity } from "../../src/entities/base-entity";

import { Timeline } from "../../src/util/timeline";
import * as timeout from "../../src/modules/timeout";

describe("Timeline", function() {
  describe("#constructor", function() {
    it("should assign array", function() {
      const entity = new BaseEntity();

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      const mock = sinon.mock(timeout);
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy1, 10)
        .returns("timeout-1");
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy2, 40)
        .returns("timeout-2");
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy3, 50)
        .returns("timeout-3");

      expect(new Timeline(entity, [
        [ 10, spy1 ],
        [ 30, spy2 ],
        [ 10, spy3 ],
      ])).to.deep.equal({
        _timeouts: [ "timeout-1", "timeout-2", "timeout-3" ],
      });

      mock.verify();
      expect(spy1).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
      expect(spy3).not.to.have.been.called;
    });

    it("should assign object", function() {
      const entity = new BaseEntity();

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      const mock = sinon.mock(timeout);
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy1, 20)
        .returns("timeout-1");
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy2, 90)
        .returns("timeout-2");
      mock.expects("timeout")
        .once()
        .withArgs(entity, spy3, 110)
        .returns("timeout-3");

      expect(new Timeline(entity, {
        20: spy1,
        90: spy2,
        110: spy3,
      })).to.deep.equal({
        _timeouts: [ "timeout-1", "timeout-2", "timeout-3" ],
      });

      mock.verify();
      expect(spy1).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
      expect(spy3).not.to.have.been.called;
    });
  });

  describe("#cancel", function() {
    beforeEach(function() {
      this.timeline = new Timeline(new BaseEntity(), []);
    });

    it("should cancel each timeout", function() {
      const spy1 = sinon.spy();
      this.timeline._timeouts.push({ cancel: spy1 });

      const spy2 = sinon.spy();
      this.timeline._timeouts.push({ cancel: spy2 });

      const spy3 = sinon.spy();
      this.timeline._timeouts.push({ cancel: spy3 });

      this.timeline.cancel();

      expect(spy1).to.have.been.calledWith();
      expect(spy2).to.have.been.calledWith();
      expect(spy3).to.have.been.calledWith();
    });
  });
});
