import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";

import { BaseEntity } from "../../src/entities/base-entity";
import { CollectionEntity } from "../../src/entities/collection-entity";

import {
  EntityAddEventData,
  EntityDestroyEventData,
  EntityChildEvent,
} from "../../src/events/entity-event";

describe("CollectionEntity", function() {
  describe("#size", function() {
    it("should equal zero", function() {
      const entity = new CollectionEntity();

      expect(entity.size()).to.equal(0);
    });

    it("should equal non zero", function() {
      const entity = new CollectionEntity();

      entity.put(new BaseEntity());
      entity.put(new BaseEntity());
      entity.put(new BaseEntity());

      expect(entity.size()).to.equal(3);
    });
  });

  describe("#put", function() {
    it("should return self", function() {
      const entity = new CollectionEntity();
      const other = new BaseEntity();

      expect(entity.put(other)).to.equal(entity);
    })

    describe("with unparented entity", function() {
      it("should increase size", function() {
        const entity = new CollectionEntity();
        const init = entity.size();
        const other = new BaseEntity();
        entity.put(other);

        expect(entity.size()).to.equal(init + 1);
      });

      it("should assign parent", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        entity.put(other);

        expect(other.parent).to.equal(entity);
      });

      it("should send enter event", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        const mockOther = sinon.mock(other);
        mockOther.expects("send")
          .once()
          .withArgs("enter", sinon.match.instanceOf(EntityChildEvent));

        entity.put(other);

        mockOther.verify();
      });
    });

    describe("with parented entity", function() {
      it("should not increase size", function() {
        const entity = new CollectionEntity();
        const init = entity.size();
        const other = new BaseEntity();
        other.parent = other;

        entity.put(other);

        expect(entity.size()).to.equal(init);
      });

      it("should not assign parent", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        other.parent = other;
        entity.put(other);

        expect(other.parent).to.equal(other);
      });

      it("should not send enter event", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        other.parent = other;
        const mockOther = sinon.mock(other);
        mockOther.expects("send").never()

        entity.put(other);

        mockOther.verify();
      });
    });
  });

  describe("#remove", function() {
    it("should return self", function() {
      const entity = new CollectionEntity();
      const other = new BaseEntity();
      entity.put(other);

      expect(entity.remove(other)).to.equal(entity);
    })

    describe("with unparented entity", function() {
      it("should decrease size", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        entity.put(other);

        const init = entity.size();
        entity.remove(other);

        expect(entity.size()).to.equal(init - 1);
      });

      it("should unassign parent", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        entity.put(other);
        entity.remove(other);

        expect(other.parent).to.equal(undefined);
      });

      it("should send enter event", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        entity.put(other);

        const mockOther = sinon.mock(other);
        mockOther.expects("send")
          .once()
          .withArgs("exit", sinon.match.instanceOf(EntityChildEvent));

        entity.remove(other);

        mockOther.verify();
      });
    });

    describe("with parented entity", function() {
      it("should not decrease size", function() {
        const entity = new CollectionEntity();
        const init = entity.size();
        const other = new BaseEntity();
        other.parent = other;

        entity.remove(other);

        expect(entity.size()).to.equal(init);
      });

      it("should not unassign parent", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        other.parent = other;
        entity.remove(other);

        expect(other.parent).to.equal(other);
      });

      it("should not send exit event", function() {
        const entity = new CollectionEntity();
        const other = new BaseEntity();
        other.parent = other;
        const mockOther = sinon.mock(other);
        mockOther.expects("send").never()

        entity.remove(other);

        mockOther.verify();
      });
    });
  });

  describe("#send", function() {
    describe("on put", function() {
      it ("should call put", function() {
        const other = new BaseEntity();
        const entity = new CollectionEntity();
        const mockEntity = sinon.mock(entity);

        mockEntity.expects("put").once()
          .withArgs(other);

        entity.send("put", {
          type: "put",
          target: other,
          config: {},
        } as EntityAddEventData);

        mockEntity.verify();
      });
    });

    describe("on remove", function() {
      it ("should call remove", function() {
        const other = new BaseEntity();
        const entity = new CollectionEntity();
        const mockEntity = sinon.mock(entity);

        mockEntity.expects("remove").once()
          .withArgs(other);

        entity.send("remove", {
          type: "remove",
          target: other,
        } as EntityDestroyEventData);

        mockEntity.verify();
      });
    });

    describe("on last", function() {
      it ("should dispatch to children", function() {
        const entity = new CollectionEntity();

        const other1 = new BaseEntity();
        entity.put(other1);
        const mockOther1 = sinon.mock(other1);
        mockOther1.expects("send").once()
          .withArgs("test-event", "test-data");

        const other2 = new BaseEntity();
        entity.put(other2);
        entity.remove(other2);
        const mockOther2 = sinon.mock(other2);
        mockOther2.expects("send").never()

        const other3 = new BaseEntity();
        entity.put(other3);
        const mockOther3 = sinon.mock(other3);
        mockOther3.expects("send").once()
          .withArgs("test-event", "test-data")
          .returns(true);

        const other4 = new BaseEntity();
        entity.put(other4);
        const mockOther4 = sinon.mock(other4);
        mockOther4.expects("send").never();

        entity.send("test-event", "test-data");
        
        mockOther1.verify();
        mockOther2.verify();
        mockOther3.verify();
        mockOther4.verify();
      });
    });
  });
});
