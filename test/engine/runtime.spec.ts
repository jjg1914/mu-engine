import "../spec-config.ts";

import * as sinon from "sinon";
import { expect } from "chai";
import * as Immutable from "immutable";

import Runtime, { Runable } from "../../src/engine/runtime";
import IO from "../../src/engine/io";

class Fixture implements Runable {
  run(any): this {
    return this;
  }
}

describe("Runtime", function() {
  describe("#constructor", function() {
    describe("with error", function() {
      beforeEach(function() {
        sinon.stub(console, "error");
      });

      afterEach(function() {
        (<any> console.error).restore();
      });

      it("should log error", function() {
        let fixture = new Fixture();
        let stub = sinon.stub();
        let subject = Runtime<Fixture>(fixture, stub);

        let error = new Error("error message");
        stub.callArgWith(0, error);

        expect(subject).to.eql({
          state: fixture,
        })
        expect(console.error).to.have.been.calledWithExactly(error);
      });
    });

    describe("with non-error", function() {
      describe("with runable", function() {
        it("should update state", function() {
          let fixture = new Fixture();
          let stub = sinon.stub();
          let subject = Runtime<Fixture>(fixture, stub);
          
          sinon.stub(fixture, "run")
            .withArgs("event-value")
            .returns("return-value");
          stub.callArgWith(0, "event-value");

          expect(subject).to.eql({ state: "return-value" });
        });
      });

      describe("with IO", function() {
        it("should run io", function() {
          let fixture = new Fixture();
          let stub = sinon.stub();
          let subject = Runtime<Fixture>(fixture, stub);
          let io = new IO(null);
          sinon.stub(io, "run");
          
          sinon.stub(fixture, "run")
            .withArgs("event-value")
            .returns(io);
          stub.callArgWith(0, "event-value");

          expect(subject).to.eql({ state: fixture });
          expect(io.run).to.have.been.calledWithExactly(
            sinon.match.func,
            sinon.match.func,
            sinon.match.func);
          (<any> io.run).callArgWith(1, "state-2");
          expect(subject).to.eql({ state: "state-2" });
          (<any> io.run).callArgWith(2, "state-3");
          expect(subject).to.eql({ state: "state-3" });
          expect((<any> io.run).args[0][0]()).to.equal("state-3");
        });
      });
    });
  });
});
