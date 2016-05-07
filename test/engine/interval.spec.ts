import "../spec-config.ts";

import * as sinon from "sinon";
import { expect } from "chai";
import * as Immutable from "immutable";

import Interval from "../../src/engine/interval";

describe("Interval", function() {
  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(1234);
  })

  afterEach(function()  {
    clock.restore();
  });

  it("should callback each tick", function() {
    let stub = sinon.stub();
    let error = new Error("message");
    sinon.stub(performance, "now").returns(1000);
    Interval(10, stub);

    expect(stub).not.to.have.been.called;
    stub.reset();

    (<any> performance.now).returns(1105);
    clock.tick(100);

    expect(stub).to.have.been.calledWithExactly(new Interval.Event({
      t: 105,
      dt: 105,
    }));
    stub.reset();

    (<any> performance.now).returns(1195);
    clock.tick(100);

    expect(stub).to.have.been.calledWithExactly(new Interval.Event({
      t: 195,
      dt: 90,
    }));
    stub.reset();

    (<any> performance.now).returns(1300);
    stub.onFirstCall().throws(error);
    clock.tick(100);

    expect(stub.args).to.eql([
      [ new Interval.Event({ t: 300, dt: 105, }) ],
      [ error ]
    ]);
    stub.reset();

    (<any> performance.now).returns(1400);
    clock.tick(100);

    expect(stub).not.to.have.been.called;
  });
});
