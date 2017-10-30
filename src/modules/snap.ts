import { PositionData } from "../components/position-component";
import { shapeFor } from "./shape";

export type SnapHorizontal = "left" | "middle" | "right";
export type SnapVertical = "top" | "middle" | "bottom";

export type SnapEntity = { position: PositionData };

export function snap(target: SnapEntity,
                     hsnap: SnapHorizontal | undefined,
                     vsnap: SnapVertical | undefined,
                     hsize: number, vsize: number)
: void {
  const dim = shapeFor(target).dimensions();

  if (hsnap !== undefined) {
    const leftX = Math.floor(target.position.x / hsize);
    const rightX = Math.floor((target.position.x + dim.width) / hsize) + 1;

    switch (hsnap) {
      case "left":
        target.position.x = leftX * hsize;
        break;
      case "middle":
        const center = Math.floor((leftX * hsize + rightX * hsize) / 2);
        target.position.x = center - Math.floor((dim.width + 1) / 2);
        break;
      case "right":
        target.position.x = (rightX * hsize) - dim.width;
        break;
    }
  }

  if (vsnap !== undefined) {
    const topY = Math.floor(target.position.y / vsize);
    const bottomY = Math.floor((target.position.y + dim.height) / vsize) + 1;

    switch (vsnap) {
      case "top":
        target.position.y = topY * vsize;
        break;
      case "middle":
        const center = Math.floor((topY * vsize + bottomY * vsize) / 2);
        target.position.y = center - Math.floor((dim.height + 1) / 2);
        break;
      case "bottom":
        target.position.y = (bottomY * vsize) - (dim.height + 1);
        break;
    }
  }
}

export function snapHoriz(target: SnapEntity,
                          hsnap: SnapHorizontal,
                          hsize: number)
: void {
  snap(target, hsnap, undefined, hsize, 0);
}

export function snapVert(target: SnapEntity,
                         vsnap: SnapVertical,
                         vsize: number)
: void {
  snap(target, undefined, vsnap, 0, vsize);
}

export function snapLeft(target: SnapEntity, hsize: number): void {
  snap(target, "left", undefined, hsize, 0);
}

export function snapRight(target: SnapEntity, hsize: number): void {
  snap(target, "right", undefined, hsize, 0);
}

export function snapTop(target: SnapEntity, vsize: number): void {
  snap(target, undefined, "top", 0, vsize);
}

export function snapBottom(target: SnapEntity, vsize: number): void {
  snap(target, undefined, "bottom", 0, vsize);
}

export function snapMiddle(target: SnapEntity, hsize: number, vsize: number)
: void {
  snap(target, "middle", "middle", hsize, vsize);
}
