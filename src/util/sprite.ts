export interface FrameData {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface TagData {
  name: string;
  from: number;
  to: number;
}

export class Sprite {
  static fromJSON(data: any): Sprite {
    const imageName = data.meta.image.split("/").reverse()[0];

    const image = new Image();
    image.src = "/assets/" + imageName;

    return new Sprite(image, _framesFor(data.frames), data.meta.frameTags);
  }

  static unserialize(data: any): Sprite {
    return Sprite.fromJSON(data);
  }

  private _image: HTMLImageElement;
  private _frames: FrameData[];
  private _tags: { [key: string]: TagData | null | undefined };

  constructor(image: HTMLImageElement, frames: FrameData[], tags: TagData[]) {
    this._image = image;
    this._frames = frames;
    this._tags = {};

    for (let e of tags) {
      this._tags[e.name] = e;
    }

    console.log(this);
  }

  drawFrame(ctx: CanvasRenderingContext2D, n: number, x: number, y: number) {
    if (n >= 0 && n < this._frames.length && this._frames[n] != null) {
      const frame = this._frames[n];

      ctx.drawImage(this._image, frame.x, frame.y, frame.width, frame.height,
                    x, y, frame.width, frame.height);
    }
  }

  duration(n: number): number {
    if (n >= 0 && n < this._frames.length && this._frames[n] != null) {
      const frame = this._frames[n];
      return frame.duration;
    } else {
      return NaN;
    }
  }

  nextIndex(tagName: string, current?: number | null): number {
    const tag = this._tags[tagName];

    if (tag != null) {
      if (current != null) {
        if (current >= tag.from && current < tag.to) {
          return current + 1;
        } else {
          return tag.from;
        }
      } else {
        return tag.from;
      }
    } else {
      return NaN;
    }
  }
}

function _framesFor(data: any) {
  const frames = [] as FrameData[];

  for (let e in data) {
    if (data.hasOwnProperty(e)) {
      const key = parseInt(e.split(" ").reverse()[0]);
      const index = Number.isNaN(key) ? 0 : key;

      frames[index] = {
        duration: Number(data[e].duration),
        x: Number(data[e].frame.x),
        y: Number(data[e].frame.y),
        width: Number(data[e].frame.w),
        height: Number(data[e].frame.h),
      };
    }
  }

  return frames;
}
