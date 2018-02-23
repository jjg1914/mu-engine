import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";
//@ts-ignore
const jsdom = require("mocha-jsdom");

import { Stage } from "../../src/util/stage";

describe("Stage", function() {
  describe(".fromTMX", function() {
    it("should assign all values", function() {
      const stage = Stage.fromTMX({
        map: {
          $: {
            width: "10",
            height: "8",
            tilewidth: "16",
            tileheight: "12",
          },
          tileset: [
            {
              $: { source: "tileset-value" },
            },
          ],
          properties: [
            {
              property: [
                { $: { name: "name1", type: "", value: "value-1" } },
                { $: { name: "name2", type: "", value: "[ 1, 2 ]" } },
                { $: { name: "name3", type: "file", value: "path/value-3" } },
              ],
            },
            {
              property: [
                { $: { name: "name4", type: "bool", value: "true" } },
                { $: { name: "name5", type: "bool", value: "false" } },
                { $: { name: "name6", type: "color", value: "#ff123456" } },
              ],
            },
          ],
          layer: [
            {
              $: { width: "4", height: "3" },
              data: [
                { _: "1,2,3,1\n" },
                { _: "4,5,6,1\n" },
                { _: "7,8,9,1\n" },
              ],
            },
          ],
          objectgroup: [
            {
              object: [
                {
                  $: {
                    type: "type-1",
                    x: "1",
                    y: "2",
                    width: "16",
                    height: "32",
                  },
                  properties: [
                    {
                      property: [
                        { $: { name: "comp1.prop1", type: "", value: "value-1" } },
                        { $: { name: "comp1.prop2", type: "", value: "value-2" } },
                        { $: { name: "comp2.prop3", type: "", value: "value-3" } },
                      ],
                    },
                    {},
                  ],
                },
                {
                  $: {
                    type: "type-2",
                    x: "3",
                    y: "4",
                    width: "12",
                    height: "24",
                    visible: "0"
                  },
                },
              ]
            },
            {
              object: [
                {
                  $: {
                    type: "type-3",
                    x: "5",
                    y: "6",
                    width: "8",
                    height: "19",
                  },
                  ellipse: [ {} ],
                },
                {
                  $: {
                    x: "5",
                    y: "5",
                    width: "10",
                    height: "10",
                  },
                  polygon: [ { $: { points: "1,2 3,4 5,6" } } ],
                },
              ]
            },
          ],
        },
      });

      expect(stage).to.deep.equal({
        _width: 160,
        _height: 96,
        _entities: [
          {
            type: "type-1",
            components: {
              position: {
                x: { type: "value", value: 1 },
                y: { type: "value", value: 2 },
                width: { type: "value", value: 16 },
                height: { type: "value", value: 32 },
              },
              render: {},
              comp1: {
                prop1: { type: "value", value: "value-1" },
                prop2: { type: "value", value: "value-2" },
              },
              comp2: {
                prop3: { type: "value", value: "value-3" },
              },
            }
          },
          {
            type: "type-2",
            components: {
              position: {
                x: { type: "value", value: 3 },
                y: { type: "value", value: 4 },
                width: { type: "value", value: 12 },
                height: { type: "value", value: 24 },
              },
            }
          },
          {
            type: "type-3",
            components: {
              position: {
                x: { type: "value", value: 5 },
                y: { type: "value", value: 6 },
                width: { type: "value", value: 8 },
                height: { type: "value", value: 19 },
                mask: {
                  type: "value",
                  value: {
                    _radius: 4,
                    _x: 0,
                    _y: 0,
                  },
                },
              },
              render: {},
            }
          },
          {
            type: "default",
            components: {
              position: {
                x: { type: "value", value: 6 },
                y: { type: "value", value: 7 },
                width: { type: "value", value: 5 },
                height: { type: "value", value: 5 },
                mask: {
                  type: "value",
                  value: {
                    verticies: [
                      [ 0, 0 ],
                      [ 2, 2 ],
                      [ 4, 4 ],
                    ],
                  },
                },
              },
              render: {},
            }
          },
        ],
        _tiles: [
          {
            width: 4,
            height: 3,
            data: [
              [ 1, 2, 3, 1 ],
              [ 4, 5, 6, 1 ],
              [ 7, 8, 9, 1 ],
            ],
          }
        ],
        _tileset: "tileset-value",
        _props: {
          name1: "value-1",
          name2: [ 1, 2 ],
          name3: "value-3",
          name4: true,
          name5: false,
          name6: "#123456",
        },
      })
    });

    it("should assign empty values", function() {
      const stage = Stage.fromTMX({
        map: {
          $: {
            width: "9",
            height: "7",
            tilewidth: "13",
            tileheight: "8",
          },
        },
      });

      expect(stage).to.deep.equal({
        _width: 117,
        _height: 56,
        _entities: [],
        _tiles: [],
        _props: {},
      });
    });

    it("should assign empty inner values", function() {
      const stage = Stage.fromTMX({
        map: {
          $: {
            width: "9",
            height: "7",
            tilewidth: "13",
            tileheight: "8",
          },
          properties: [ {} ],
          layer: [
            {
              $: { width: "3", height: "2" },
            },
            {
              $: { width: "5", height: "4" },
              data: [ {} ],
            },
          ],
          objectgroup: [ {} ],
        },
      });

      expect(stage).to.deep.equal({
        _width: 117,
        _height: 56,
        _entities: [],
        _tiles: [
          {
            width: 3,
            height: 2,
            data: [
              [ 0, 0, 0 ],
              [ 0, 0, 0 ],
            ],
          },
          {
            width: 5,
            height: 4,
            data: [
              [ 0, 0, 0, 0, 0 ],
              [ 0, 0, 0, 0, 0 ],
              [ 0, 0, 0, 0, 0 ],
              [ 0, 0, 0, 0, 0 ],
            ],
          },
        ],
        _props: {},
      });
    });

    it("should throw empty path error", function() {
      expect(function() {
        Stage.fromTMX({
          map: {
            $: {
              width: "9",
              height: "7",
              tilewidth: "13",
              tileheight: "8",
            },
            objectgroup: [
              {
                object: [
                  {
                    $: {
                      type: "type-1",
                      x: "1",
                      y: "2",
                      width: "16",
                      height: "32",
                    },
                    properties: [
                      {
                        property: [
                          { $: { name: "comp1", type: "", value: "value-1" } },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
      }).to.throw();
    });
  });

  describe(".unserialize", function() {
    it("should call fromTMX", function() {
      const mock = sinon.mock(Stage);
      mock.expects("fromTMX").once().withArgs("data-value");

      Stage.unserialize("data-value");
      mock.verify();
    });

    it("should return fromTMX value", function() {
      sinon.stub(Stage, "fromTMX").returns("rval");

      expect(Stage.unserialize("data-value")).to.equal("rval");
    });
  });

  describe("#constructor", function() {
    it("should assgin values", function() {
      expect(new Stage(123, 456, "path/to/tileset-v")).to.deep.equal({
        _entities: [],
        _tiles: [],
        _width: 123,
        _height: 456,
        _tileset: "tileset-v",
        _props: {},
      });
    });

    it("should allow optional tileset", function() {
      expect(new Stage(123, 456)).to.deep.equal({
        _entities: [],
        _tiles: [],
        _width: 123,
        _height: 456,
        _props: {},
      });
    });
  });

  describe("#prop", function() {
    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should assign property", function() {
      this.stage.prop("keyv", "valuev")

      expect(this.stage).to.deep.equal({
        _width: 123,
        _height: 456,
        _entities: [],
        _tiles: [],
        _props: { keyv: "valuev" },
      });
    });

    it("should return property", function() {
      this.stage._props = { keyk: "valuek" };

      expect(this.stage.prop("keyk")).to.equal("valuek");
    });
  });

  describe("#bounds", function() {
    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should return bounds", function() {
      expect(this.stage.bounds()).to.deep.equal({
        left: 0,
        top: 0,
        right: 122,
        bottom: 455,
      });
    });
  });

  describe("#buildLayers", function() {
    jsdom();

    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should return empty array", function() {
      const assets = { load: () => {} };
      const mock = sinon.mock(assets);
      mock.expects("load").never();

      expect(this.stage.buildLayers({ assets: assets })).to.deep.equal([]);
      mock.verify();
    });

    it("should return layer array", function() {
      this.stage._tileset = "tileset-v"
      this.stage._tiles.push({
        width: 2,
        height: 2,
        data: [
          [ 0, 1 ],
          [ 2, 3 ],
        ],
      })

      const assets = { load: () => {} };
      const canvas = { getContext: () => {}, width: 0, height: 0 };
      const tileset = { ready: () => {}, drawTile: () => {} };

      const mockTileset = sinon.mock(tileset);
      mockTileset.expects("ready")
        .once()
        .withArgs(sinon.match.func)
        .callsArg(0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 0, 0, 0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 1, 1, 0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 2, 0, 1);
      mockTileset.expects("drawTile").once().withArgs("ctx", 3, 1, 1);

      const mockCanvas = sinon.mock(canvas);
      mockCanvas.expects("getContext").once().withArgs("2d").returns("ctx");

      const mockAssets = sinon.mock(assets);
      mockAssets.expects("load").once().withArgs("tileset-v").returns(tileset);

      const mockDocument = sinon.mock(document);
      mockDocument.expects("createElement")
        .once()
        .withArgs("canvas")
        .returns(canvas);

      expect(this.stage.buildLayers({ assets: assets })).to.deep.equal([
        { image: canvas },
      ]);
      expect(canvas.width).to.equal(123);
      expect(canvas.height).to.equal(456);
      mockDocument.verify();
      mockTileset.verify();
      mockCanvas.verify();
      mockAssets.verify();
    });

    it("should throw error", function() {
      this.stage._tileset = "tileset-v"
      this.stage._tiles.push({
        width: 2,
        height: 2,
        data: [
          [ 0, 1 ],
          [ 2, 3 ],
        ],
      })

      const assets = { load: () => {} };
      const canvas = { getContext: () => {}, width: 0, height: 0 };
      const tileset = { ready: () => {}, drawTile: () => {} };

      const mockTileset = sinon.mock(tileset);
      mockTileset.expects("ready").never();
      mockTileset.expects("drawTile").never();

      const mockCanvas = sinon.mock(canvas);
      mockCanvas.expects("getContext").once().withArgs("2d").returns(null);

      const mockAssets = sinon.mock(assets);
      mockAssets.expects("load").once().withArgs("tileset-v").returns(tileset);

      const mockDocument = sinon.mock(document);
      mockDocument.expects("createElement")
        .once()
        .withArgs("canvas")
        .returns(canvas);

      const self = this;
      expect(function() {
        self.stage.buildLayers({ assets: assets })
      }).to.throw();

      expect(canvas.width).to.equal(0);
      expect(canvas.height).to.equal(0);

      mockDocument.verify();
      mockTileset.verify();
      mockCanvas.verify();
      mockAssets.verify();
    });
  });

  describe("#buildEntities", function() {
    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should return empty array", function() {
      const assets = { load: () => {} };
      const mock = sinon.mock(assets);
      mock.expects("load").never();

      expect(this.stage.buildEntities({ assets: assets })).to.deep.equal([]);
      mock.verify();
    });

    it("should return entity array", function() {
      this.stage._entities.push({
        type: "test0",
        components: {},
      });

      this.stage._entities.push({
        type: "test1",
        components: {},
      });

      this.stage._entities.push({
        type: "test2",
        components: { comp1: {} },
      });

      this.stage._entities.push({
        type: "test3",
        components: {
          comp1: {
            prop1: { type: "value", value: "value-1" },
            prop2: { type: "asset", value: "asset-name-1" },
          },
        },
      });

      const assets = { load: () => {} };

      const stub1 = sinon.stub();
      stub1.returns({ entity: 1 });
      const stub2 = sinon.stub();
      stub2.returns({ entity: 2 });
      const stub3 = sinon.stub();
      stub3.returns({ entity: 3 });

      const mock = sinon.mock(assets);
      mock.expects("load").once().withArgs("test0-entity").returns(undefined);
      mock.expects("load").once().withArgs("test1-entity").returns(stub1);
      mock.expects("load").once().withArgs("test2-entity").returns(stub2);
      mock.expects("load").once().withArgs("test3-entity").returns(stub3);
      mock.expects("load").once().withArgs("asset-name-1").returns("asset-1");

      expect(this.stage.buildEntities({ assets: assets })).to.deep.equal([
        { entity: 1 },
        { entity: 2 },
        { entity: 3 },
      ]);

      expect(stub1).to.have.been.calledWith({});
      expect(stub2).to.have.been.calledWith({ comp1: {} });
      expect(stub3).to.have.been.calledWith({
        comp1: {
          prop1: "value-1",
          prop2: "asset-1",
        },
      });
      mock.verify();
    });
  });

  describe("#addEntity", function() {
    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should push entities", function() {
      this.stage.addEntity("entity1");
      this.stage.addEntity("entity2");
      this.stage.addEntity("entity3");

      expect(this.stage).to.deep.equal({
        _entities: [ "entity1", "entity2", "entity3" ],
        _tiles: [],
        _width: 123,
        _height: 456,
        _props: {},
      });
    })
  });

  describe("#addLayer", function() {
    beforeEach(function() {
      this.stage = new Stage(123, 456);
    });

    it("should push entities", function() {
      this.stage.addLayer("entity1");
      this.stage.addLayer("entity2");
      this.stage.addLayer("entity3");

      expect(this.stage).to.deep.equal({
        _entities: [],
        _tiles: [ "entity1", "entity2", "entity3" ],
        _width: 123,
        _height: 456,
        _props: {},
      });
    })
  });
});
