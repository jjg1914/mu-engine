import { PositionData } from "../components/position-component";
import { Shape, Polygon, Circle } from "../util/shape";

export function shapeFor(entity: { position: PositionData }): Shape {
  let mask = entity.position.mask;

  if (mask === undefined) {
    const width = entity.position.width;
    const height = entity.position.height;

    mask = new Polygon([
      [ 0, 0 ],
      [ width - 1, 0 ],
      [ width - 1, height - 1 ],
      [ 0, height - 1 ],
    ]);
  } else {
    mask = mask.clone();
  }

  const rotate = entity.position.rotate;

  if (rotate !== undefined) {
    mask = mask.rotate(rotate);
  }

  const x = entity.position.x;
  const y = entity.position.y;

  mask = mask.translate(x, y);

  if (mask instanceof Circle) {
    mask = mask.translate(mask.radius(), mask.radius());
  }

  return mask;
}
