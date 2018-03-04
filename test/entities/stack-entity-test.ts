import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";

import { BaseEntity } from "../../src/entities/base-entity";
import { StackEntity } from "../../src/entities/stack-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
  EntityChildEvent,
} from "../../src/events/entity-event";

describe("StackEntity", function() {
  describe("#size", function() {
    it("should equal zero", function() {
      const entity = new StackEntity();

      expect(entity.size()).to.equal(0);
    });

    it("should equal non zero", function() {
      const entity = new StackEntity();

      entity.push(new BaseEntity());
      entity.push(new BaseEntity());
      entity.push(new BaseEntity());

      expect(entity.size()).to.equal(3);
    });
  });

  describe("#push", function() {
    it("should return self", function() {
      const entity = new StackEntity();
      const other = new BaseEntity();

      expect(entity.push(other)).to.equal(entity);
    })

    describe("with unparented entity", function() {
      it("should increase size", function() {
        const entity = new StackEntity();
        const init = entity.size();
        const other = new BaseEntity();
        entity.push(other);

        expect(entity.size()).to.equal(init + 1);
      });

      it("should assign parent", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        entity.push(other);

        expect(other.parent).to.equal(entity);
      });

      it("should send enter event", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        const mockOther = sinon.mock(other);
        mockOther.expects("send")
          .once()
          .withArgs("enter", sinon.match.instanceOf(EntityChildEvent));

        entity.push(other);

        mockOther.verify();
      });
    });

    describe("with parented entity", function() {
      it("should not increase size", function() {
        const entity = new StackEntity();
        const init = entity.size();
        const other = new BaseEntity();
        other.parent = other;

        entity.push(other);

        expect(entity.size()).to.equal(init);
      });

      it("should not assign parent", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        other.parent = other;
        entity.push(other);

        expect(other.parent).to.equal(other);
      });

      it("should not send enter event", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        other.parent = other;
        const mockOther = sinon.mock(other);
        mockOther.expects("send").never()

        entity.push(other);

        mockOther.verify();
      });
    });
  });

  describe("#pop", function() {
    it("should return self", function() {
      const entity = new StackEntity();
      const other = new BaseEntity();
      entity.push(other);

      expect(entity.pop()).to.equal(entity);
    })

    describe("with not empty", function() {
      it("should decrease size", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        entity.push(other);

        const init = entity.size();
        entity.pop();

        expect(entity.size()).to.equal(init - 1);
      });

      it("should unassign parent", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        entity.push(other);
        entity.pop();

        expect(other.parent).to.equal(undefined);
      });

      it("should send enter event", function() {
        const entity = new StackEntity();
        const other = new BaseEntity();
        entity.push(other);

        const mockOther = sinon.mock(other);
        mockOther.expects("send")
          .once()
          .withArgs("exit", sinon.match.instanceOf(EntityChildEvent));

        entity.pop();

        mockOther.verify();
      });
    });

    describe("with empty", function() {
      it("should not decrease size", function() {
        const entity = new StackEntity();
        const init = entity.size();

        entity.pop();

        expect(entity.size()).to.equal(init);
      });
    });
  });

  describe("#swap", function() {
    it("should pop and push", function() {
      const entity = new StackEntity();
      const other = new BaseEntity();
      const mockEntity = sinon.mock(entity);

      mockEntity.expects("pop").once().withExactArgs().returns(entity);
      mockEntity.expects("push").once().withExactArgs(other, {});

      entity.swap(other);

      mockEntity.verify();
    });
  });

  describe("#send", function() {
    describe("on push", function() {
      it ("should call push", function() {
        const other = new BaseEntity();
        const entity = new StackEntity();
        const mockEntity = sinon.mock(entity);

        mockEntity.expects("push").once()
          .withArgs(other);

        entity.send("push", {
          type: "push",
          target: other,
          config: {},
        } as EntityAddEventData);

        mockEntity.verify();
      });
    });

    describe("on pop", function() {
      it ("should call pop", function() {
        const other = new BaseEntity();
        const entity = new StackEntity();
        const mockEntity = sinon.mock(entity);

        mockEntity.expects("pop").once()
          .withArgs();

        entity.send("pop", {
          type: "pop",
          target: other,
        } as EntityDestroyEventData);

        mockEntity.verify();
      });
    });

    describe("on swap", function() {
      it ("should call swap", function() {
        const other = new BaseEntity();
        const entity = new StackEntity();
        const mockEntity = sinon.mock(entity);

        mockEntity.expects("swap").once()
          .withArgs(other);

        entity.send("swap", {
          type: "swap",
          target: other,
          config: {},
        } as EntityAddEventData);

        mockEntity.verify();
      });
    });


    describe("on last", function() {
      it ("should dispatch to children", function() {
        const entity = new StackEntity();

        const other1 = new BaseEntity();
        entity.push(other1);
        const mockOther1 = sinon.mock(other1);
        mockOther1.expects("send").never();

        const other2 = new BaseEntity();
        entity.push(other2);
        const mockOther2 = sinon.mock(other2);
        mockOther2.expects("send").once()
          .withArgs("test-event", "test-data")
          .returns(true);

        const other3 = new BaseEntity();
        entity.push(other3);
        entity.pop();
        const mockOther3 = sinon.mock(other3);
        mockOther3.expects("send").never();

        const other4 = new BaseEntity();
        entity.push(other4);
        const mockOther4 = sinon.mock(other4);
        mockOther4.expects("send").once()
          .withArgs("test-event", "test-data");

        entity.send("test-event", "test-data");
        
        mockOther1.verify();
        mockOther2.verify();
        mockOther3.verify();
        mockOther4.verify();
      });

      it ("should dispatch to not blocked children", function() {
        const entity = new StackEntity();

        const other1 = new BaseEntity();
        entity.push(other1);
        const mockOther1 = sinon.mock(other1);
        mockOther1.expects("send").never();

        const other2 = new BaseEntity();
        entity.push(other2, { block: true });
        const mockOther2 = sinon.mock(other2);
        mockOther2.expects("send").once()
          .withArgs("test-event", "test-data");

        const other3 = new BaseEntity();
        entity.push(other3);
        const mockOther3 = sinon.mock(other3);
        mockOther3.expects("send").once()
          .withArgs("test-event", "test-data");

        entity.send("test-event", "test-data");
        
        mockOther1.verify();
        mockOther2.verify();
        mockOther3.verify();
      });
    });
  });
});
