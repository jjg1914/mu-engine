import "../test_helper";

// import { expect } from "chai";
// import * as sinon from "sinon";

import { BaseEntity } from "../../src/entities/base-entity";
import {
  PositionData,
  PositionComponent,
} from "../../src/components/position-component";
import {
  CollisionData,
  CollisionComponent,
} from "../../src/components/collision-component";
import { Collision } from "../../src/util/collision";

class MockCollisionEntity extends BaseEntity {
  position: PositionData;
  collision: CollisionData;

  constructor() {
    super();

    this.position = new PositionComponent();
    this.collision = new CollisionComponent();
  }
}

describe("Collision", function() {
  describe(".checkBounds", function() {
  });

  describe(".check", function() {
  });

  describe("#iterator", function() {
    it("should yeild every entity", function() {
      const collision = new Collision({
        top: -10,
        left: -10,
        bottom: 10,
        right: 10,
      });

      const other1 = new MockCollisionEntity();
      const other2 = new MockCollisionEntity();
      const other3 = new MockCollisionEntity();

      collision.add(other1);
      collision.add(other2);
      collision.add(other3);

      /*
      const a = [];
      for (let e of collision) {
        a.push(e);
      }
      expect(a).to.deep.equal([ other1, other2, other3 ]);
      */
    });
  });

  describe("#bounds", function() {
  });

  describe("#add", function() {
  });

  describe("#queryBounds", function() {
  });

  describe("#query", function() {
  });
});
