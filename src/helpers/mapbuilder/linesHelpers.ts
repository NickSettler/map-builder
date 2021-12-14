import Line from "./line";
import Point from "./point";
import { TRIPLET_ORIENTATION } from "./consts";
import { pointOnLine, tripletOrientation } from "./pointsHelpers";
import { v4 } from "uuid";

export const connected = (line1: Line, line2: Line): boolean => {
  return (
    (line1.point1.x === line2.point1.x && line1.point1.y === line2.point1.y) ||
    (line1.point1.x === line2.point2.x && line1.point1.y === line2.point2.y) ||
    (line1.point2.x === line2.point1.x && line1.point2.y === line2.point1.y) ||
    (line1.point2.x === line2.point2.x && line1.point2.y === line2.point2.y)
  );
};

export const intersect = (line1: Line, line2: Line): Point | false => {
  const o1 = tripletOrientation(line1.point1, line1.point2, line2.point1);
  const o2 = tripletOrientation(line1.point1, line1.point2, line2.point2);
  const o3 = tripletOrientation(line2.point1, line2.point2, line1.point1);
  const o4 = tripletOrientation(line2.point1, line2.point2, line1.point2);

  if (o1 !== o2 && o3 !== o4) {
    const x =
      ((line1.point1.x * line1.point2.y - line1.point1.y * line1.point2.x) *
        (line2.point1.x - line2.point2.x) -
        (line1.point1.x - line1.point2.x) *
          (line2.point1.x * line2.point2.y - line2.point1.y * line2.point2.x)) /
      ((line1.point1.x - line1.point2.x) * (line2.point1.y - line2.point2.y) -
        (line1.point1.y - line1.point2.y) * (line2.point1.x - line2.point2.x));
    const y =
      ((line1.point1.x * line1.point2.y - line1.point1.y * line1.point2.x) *
        (line2.point1.y - line2.point2.y) -
        (line1.point1.y - line1.point2.y) *
          (line2.point1.x * line2.point2.y - line2.point1.y * line2.point2.x)) /
      ((line1.point1.x - line1.point2.x) * (line2.point1.y - line2.point2.y) -
        (line1.point1.y - line1.point2.y) * (line2.point1.x - line2.point2.x));

    return new Point({ id: v4(), x, y });
  }

  if (
    o1 === TRIPLET_ORIENTATION.COLLINEAR &&
    pointOnLine(line1.point1, line2.point1, line2.point2)
  ) {
    return line1.point1;
  }

  if (
    o2 === TRIPLET_ORIENTATION.COLLINEAR &&
    pointOnLine(line1.point2, line2.point1, line2.point2)
  ) {
    return line1.point2;
  }

  if (
    o3 === TRIPLET_ORIENTATION.COLLINEAR &&
    pointOnLine(line2.point1, line1.point1, line1.point2)
  ) {
    return line2.point1;
  }

  if (
    o4 === TRIPLET_ORIENTATION.COLLINEAR &&
    pointOnLine(line2.point2, line1.point1, line1.point2)
  ) {
    return line2.point2;
  }

  return false;
};

export const splitIntersection = (line1: Line, line2: Line): Line[] | false => {
  const intersection = intersect(line1, line2);

  if (intersection) {
    return [
      new Line({
        id: v4(),
        x1: line1.point1.x,
        y1: line1.point1.y,
        x2: intersection.x,
        y2: intersection.y,
      }),
      new Line({
        id: v4(),
        x1: intersection.x,
        y1: intersection.y,
        x2: line1.point2.x,
        y2: line1.point2.y,
      }),
      new Line({
        id: v4(),
        x1: line2.point1.x,
        y1: line2.point1.y,
        x2: intersection.x,
        y2: intersection.y,
      }),
      new Line({
        id: v4(),
        x1: intersection.x,
        y1: intersection.y,
        x2: line2.point2.x,
        y2: line2.point2.y,
      }),
    ];
  }

  return false;
};
