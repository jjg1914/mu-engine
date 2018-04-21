import "../test_helper";

import { expect } from "chai";
import * as sinon from "sinon";

import { TilesetEntity } from "../../src/entities/tileset-entity";

const sandbox = sinon.createSandbox();

describe("TilesetEntity", function() {
  afterEach(function() {
    sandbox.restore();
  });

  describe("#constructor", function() {
    it("should draw tiles to render image", function() {
      const assets = { load: () => {} };
      const canvas = { getContext: () => {}, width: 0, height: 0 };
      const tileset = { ready: () => {}, drawTile: () => {} };

      const mockTileset = sandbox.mock(tileset);
      mockTileset.expects("ready")
        .once()
        .withArgs(sinon.match.func)
        .callsArg(0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 0, 0, 0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 1, 1, 0);
      mockTileset.expects("drawTile").once().withArgs("ctx", 2, 0, 1);
      mockTileset.expects("drawTile").once().withArgs("ctx", 3, 1, 1);

      const mockCanvas = sandbox.mock(canvas);
      mockCanvas.expects("getContext").once().withArgs("2d").returns("ctx");

      const mockAssets = sandbox.mock(assets);
      mockAssets.expects("load").once().withArgs("tileset-v").returns(tileset);

      const mockDocument = sandbox.mock(document);
      mockDocument.expects("createElement")
        .once()
        .withArgs("canvas")
        .returns(canvas);

      const tilesetEntity = new TilesetEntity({
        tileset: {
          tileset: "tileset-v",
          assets: assets,
          data: [
            [ 0, 1 ],
            [ 2, 3 ],
          ],
        },
      });

      expect(tilesetEntity).to.containSubset({
        tileset: {
          tileset: "tileset-v",
          assets: assets,
          data: [
            [ 0, 1 ],
            [ 2, 3 ],
          ],
        },
        render: {
          image: canvas,
        },
        position: {
          width: 0,
          height: 0,
        },
      });

      sandbox.verify();
    });

    it("should throw error", function() {
      const assets = { load: () => {} };
      const canvas = { getContext: () => {}, width: 0, height: 0 };
      const tileset = { ready: () => {}, drawTile: () => {} };

      const mockTileset = sandbox.mock(tileset);
      mockTileset.expects("ready").never();
      mockTileset.expects("drawTile").never();

      const mockCanvas = sandbox.mock(canvas);
      mockCanvas.expects("getContext").once().withArgs("2d").returns(null);

      const mockAssets = sandbox.mock(assets);
      mockAssets.expects("load").never();

      const mockDocument = sandbox.mock(document);
      mockDocument.expects("createElement")
        .once()
        .withArgs("canvas")
        .returns(canvas);

      expect(function() {
        new TilesetEntity({
          tileset: {
            tileset: "tileset-v",
            assets: assets,
            data: [
              [ 0, 1 ],
              [ 2, 3 ],
            ],
          },
        });
      }).to.throw();

      sandbox.verify();
    });
  });
});
