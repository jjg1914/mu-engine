import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";
//@ts-ignore
const jsdom = require("mocha-jsdom");

import { TilesetEntity } from "../../src/entities/tileset-entity";
import { Stage } from "../../src/util/stage";

describe("Stage", function() {
  describe(".fromTMX", function() {
    it("should assign all values", function() {
      const stage = Stage.fromTMX({
        "#name": "map",
        $: {
          width: "10",
          height: "8",
          tilewidth: "16",
          tileheight: "12",
        },
        $$: [
          {
            "#name": "tileset",
            $: { source: "tileset-value" },
          },
          {
            "#name": "properties",
            $$: [
              {
                "#name": "property",
                $: { name: "name1", type: "", value: "value-1" },
              },
              {
                "#name": "property",
                $: { name: "name2", type: "", value: "[ 1, 2 ]" },
              },
              {
                "#name": "property",
                $: { name: "name3", type: "file", value: "path/value-3" },
              },
            ],
          },
          {
            "#name": "properties",
            $$: [
              {
                "#name": "property",
                $: { name: "name4", type: "bool", value: "true" },
              },
              {
                "#name": "property",
                $: { name: "name5", type: "bool", value: "false" },
              },
              {
                "#name": "property",
                $: { name: "name6", type: "color", value: "#ff123456" },
              },
            ],
          },
          {
            "#name": "imagelayer",
            $$:  [
              {
                "#name": "image",
                $: {
                  source: "path/to/background.png",
                  width: "321",
                  height: "654",
                },
              },
            ],
          },
          {
            "#name": "layer",
            $: { width: "4", height: "3" },
            $$: [
              {
                "#name": "data",
                $: { encoding: "csv" },
                _: "1,2,3,1\n4,5,6,1\n7,8,9,1",
              }
            ],
          },
          {
            "#name": "objectgroup",
            $$: [
              {
                "#name": "object",
                $: {
                  type: "type-1",
                  x: "1",
                  y: "2",
                  width: "16",
                  height: "32",
                },
                $$: [
                  {
                    "#name": "properties",
                    $$: [
                      {
                        "#name": "property",
                        $: { name: "comp1.prop1", type: "", value: "value-1" },
                      },
                      {
                        "#name": "property",
                        $: { name: "comp1.prop2", type: "", value: "value-2" },
                      },
                      {
                        "#name": "property",
                        $: { name: "comp2.prop3", type: "", value: "value-3" },
                      },
                    ],
                  },
                  {
                    "#name": "junk",
                  } as any,
                ],
              },
              {
                "#name": "object",
                $: {
                  type: "type-2",
                  x: "3",
                  y: "4",
                  width: "12",
                  height: "24",
                  visible: "0",
                },
              },
            ],
          },
          {
            "#name": "layer",
            $: { width: "3", height: "4" },
            $$: [
              {
                "#name": "data",
                $: { encoding: "csv" },
              }
            ],
          },
          {
            "#name": "objectgroup",
            $$: [
              {
                "#name": "object",
                $: {
                  type: "type-3",
                  x: "5",
                  y: "6",
                  width: "8",
                  height: "19",
                },
                $$: [ { "#name": "ellipse" }, { "#name": "properties" } ],
              },
              {
                "#name": "object",
                $: {
                  x: "5",
                  y: "5",
                  width: "10",
                  height: "10",
                },
                $$: [
                  {
                    "#name": "polygon",
                    $: { points: "1,2 3,4 5,6" } ,
                  }
                ],
              },
            ],
          },
          {
            "#name": "junk"
          } as any,
        ],
      });

      expect(stage).to.deep.equal({
        _width: 160,
        _height: 96,
        _entities: [
          {
            type: "background",
            components: {
              position: {
                x: { type: "value", value: 0 },
                y: { type: "value", value: 0 },
                width: { type: "value", value: 321 },
                height: { type: "value", value: 654 },
              },
              render: {
                image: { type: "asset", value: "background.png" },
              },
            }
          },
          {
            type: "tileset",
            components: {
              tileset: {
                data: {
                  type: "value",
                  value: [
                    [ 1, 2, 3, 1 ],
                    [ 4, 5, 6, 1 ],
                    [ 7, 8, 9, 1 ],
                  ],
                },
              },
            }
          },
          {
            type: "type-1",
            components: {
              position: {
                x: { type: "value", value: 1 },
                y: { type: "value", value: 2 },
                width: { type: "value", value: 16 },
                height: { type: "value", value: 32 },
              },
              render: {
                visible: { type: "value", value: true },
              },
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
              render: {
                visible: { type: "value", value: false },
              },
            }
          },
          {
            type: "tileset",
            components: {
              tileset: {
                data: {
                  type: "value",
                  value: [
                    [ 0, 0, 0 ],
                    [ 0, 0, 0 ],
                    [ 0, 0, 0 ],
                    [ 0, 0, 0 ],
                  ],
                },
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
              render: {
                visible: { type: "value", value: true },
              },
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
              render: {
                visible: { type: "value", value: true },
              },
            }
          },
        ],
        _props: {
          name1: "value-1",
          name2: [ 1, 2 ],
          name3: "value-3",
          name4: true,
          name5: false,
          name6: "#123456",
          tileset: "tileset-value",
        },
      })
    });

    it("should assign empty values", function() {
      const stage = Stage.fromTMX({
        "#name": "map",
        $: {
          width: "9",
          height: "7",
          tilewidth: "13",
          tileheight: "8",
        },
      });

      expect(stage).to.deep.equal({
        _width: 117,
        _height: 56,
        _entities: [],
        _props: {},
      });
    });

    it("should assign empty inner values", function() {
      const stage = Stage.fromTMX({
        "#name": "map",
        $: {
          width: "9",
          height: "7",
          tilewidth: "13",
          tileheight: "8",
        },
        $$: [
          {
            "#name": "properties",
          },
          {
            "#name": "objectgroup",
          },
        ],
      });

      expect(stage).to.deep.equal({
        _width: 117,
        _height: 56,
        _entities: [],
        _props: {},
      });
    });

    it("should throw empty path error", function() {
      expect(function() {
        Stage.fromTMX({
          "#name": "map",
          $: {
            width: "9",
            height: "7",
            tilewidth: "13",
            tileheight: "8",
          },
          $$: [
            {
              "#name": "objectgroup",
              $$: [
                {
                  "#name": "object",
                  $: {
                    type: "type-1",
                    x: "1",
                    y: "2",
                    width: "16",
                    height: "32",
                  },
                  $$: [
                    {
                      "#name": "properties",
                      $$: [
                        {
                          "#name": "property",
                          $: { name: "comp1", type: "", value: "value-1" },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      }).to.throw();
    });
  });

  describe(".unserialize", function() {
    it("should call fromTMX", function() {
      const mock = sinon.mock(Stage);
      mock.expects("fromTMX").once().withArgs("data-value").returns("rval");

      expect(Stage.unserialize({ map: "data-value" })).to.equal("rval");
      mock.verify();
    });
  });

  describe("#prop", function() {
    it("should return undefined property", function() {
      const stage = new Stage(123, 456);

      expect(stage.prop("keyk")).to.be.undefined;
    });

    it("should assign property", function() {
      const stage = new Stage(123, 456);
      stage.prop("keyk", "valuev")

      expect(stage.prop("keyk")).to.equal("valuev");
    });
  });

  describe("#bounds", function() {
    it("should return bounds", function() {
      const stage = new Stage(123, 456);

      expect(stage.bounds()).to.deep.equal({
        left: 0,
        top: 0,
        right: 122,
        bottom: 455,
      });
    });
  });

  describe("#buildEntities", function() {
    it("should return empty array", function() {
      const stage = new Stage(123, 456);

      const assets = { load: () => {} };
      const mock = sinon.mock(assets);
      mock.expects("load").never();

      expect(stage.buildEntities({ assets: assets })).to.deep.equal([]);
      mock.verify();
    });

    it("should return entity array", function() {
      const stage = new Stage(123, 456);

      stage.prop("tileset", "tileset-v")

      stage.addEntity({
        type: "test0",
        components: {},
      });

      stage.addEntity({
        type: "test1",
        components: {},
      });

      stage.addEntity({
        type: "test2",
        components: { comp1: {} },
      });

      stage.addEntity({
        type: "test3",
        components: {
          comp1: {
            prop1: { type: "value", value: "value-1" },
            prop2: { type: "asset", value: "asset-name-1" },
          },
        },
      });

      stage.addEntity({
        type: "tileset",
        components: {
          tileset: {
            data: {
              type: "value",
              value: [
                [ 0, 1 ],
                [ 2, 3 ],
              ],
            },
          },
        },
      })

      const assets = { load: () => {} };

      const stub1 = sinon.stub();
      stub1.returns({ entity: 1 });
      const stub2 = sinon.stub();
      stub2.returns({ entity: 2 });
      const stub3 = sinon.stub();
      stub3.returns({ entity: 3 });
      const stub4 = sinon.stub();
      stub4.returns({ entity: 4 });

      const mock = sinon.mock(assets);
      mock.expects("load").once().withArgs("test0-entity").returns(undefined);
      mock.expects("load").once().withArgs("test1-entity").returns(stub1);
      mock.expects("load").once().withArgs("test2-entity").returns(stub2);
      mock.expects("load").once().withArgs("test3-entity").returns(stub3);
      mock.expects("load").once().withArgs("tileset-entity").returns(stub4);
      mock.expects("load").once().withArgs("asset-name-1").returns("asset-1");

      expect(stage.buildEntities({ assets: assets })).to.deep.equal([
        { entity: 1 },
        { entity: 2 },
        { entity: 3 },
        { entity: 4 },
      ]);

      expect(stub1).to.have.been.calledWith({});
      expect(stub2).to.have.been.calledWith({ comp1: {} });
      expect(stub3).to.have.been.calledWith({
        comp1: {
          prop1: "value-1",
          prop2: "asset-1",
        },
      });
      expect(stub4).to.have.been.calledWith({
        position: {
          width: 123,
          height: 456,
        },
        tileset: {
          tileset: "tileset-v",
          assets: sinon.match.same(assets),
          data: [
            [ 0, 1 ],
            [ 2, 3 ],
          ],
        },
      });
      mock.verify();
    });

    it("should return default tileset", function() {
      const stage = new Stage(123, 456);

      stage.addEntity({
        type: "tileset",
        components: {
          tileset: {
            data: {
              type: "value",
              value: [
                [ 0, 1 ],
                [ 2, 3 ],
              ],
            },
          },
        },
      })

      const assets = { load: () => {} };

      const stub1 = sinon.stub();
      stub1.returns({ entity: 1 });

      const mock = sinon.mock(assets);
      mock.expects("load").once().withArgs("tileset-entity").returns(stub1);

      expect(stage.buildEntities({ assets: assets })).to.deep.equal([
        { entity: 1 },
      ]);

      expect(stub1).to.have.been.calledWith({
        position: {
          width: 123,
          height: 456,
        },
        tileset: {
          tileset: "",
          assets: sinon.match.same(assets),
          data: [
            [ 0, 1 ],
            [ 2, 3 ],
          ],
        },
      });
      mock.verify();
    });
  });
});
