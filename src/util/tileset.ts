import { Dimensions } from "./shape";

export class Tileset {
  private _image: HTMLImageElement;
  // private _width: number;
  // private _height: number;
  private _tileHeight: number;
  private _tileWidth: number;
  private _rows: number;
  private _columns: number;
  private _ready: Promise<void>;

  constructor(image: HTMLImageElement,
              width: number, height: number,
              tileWidth: number, tileHeight: number) {
    this._image = image;
    // this._width = width;
    // this._height = height;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;

    this._columns = Math.ceil(width / tileWidth);
    this._rows = Math.ceil(height / tileHeight);

    this._ready = new Promise((resolve) => {
      this._image.addEventListener("load", () => {
        resolve();
      });
    });
  }

  static fromTMX(data: any): Tileset {
    const tileWidth = Number(data.tileset.$.tilewidth);
    const tileHeight = Number(data.tileset.$.tileheight);
    const width = Number(data.tileset.image[0].width);
    const height = Number(data.tileset.image[0].height);

    const image = new Image();
    image.src = "/assets/" + data.tileset.image[0].source;

    return new Tileset(image, width, height, tileWidth, tileHeight);
  }

  static fromJSON(data: any): Tileset {
    const tileWidth = Number(data.tilewidth);
    const tileHeight = Number(data.tileheight);
    const width = Number(data.imagewidth);
    const height = Number(data.imageheight);

    const image = new Image();
    image.src = "/assets/tilesets/" + data.image;

    return new Tileset(image, width, height, tileWidth, tileHeight);
  }

  static unserialize(data: any): Tileset {
    if (data.tileset !== undefined) {
      return Tileset.fromTMX(data);
    } else {
      return Tileset.fromJSON(data);
    }
  }

  drawTile(ctx: CanvasRenderingContext2D, n: number, x: number, y: number) {
    if (n !== 0 && n <= this._columns * this._rows) {
      n -= 1;

      const i = n % this._columns;
      const j = Math.floor(n / this._columns);

      ctx.drawImage(this._image, i * this._tileWidth, j * this._tileWidth,
                    this._tileWidth, this._tileHeight,
                    x * this._tileWidth, y * this._tileHeight,
                    this._tileWidth, this._tileHeight);
    }
  }

  ready(f: Function) {
    // tslint:disable-next-line:no-floating-promises
    this._ready.then(() => { f(); });
  }

  tileDimensions(): Dimensions {
    return { width: this._tileHeight, height: this._tileHeight };
  }
}
