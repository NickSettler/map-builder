import Point from "./point";
import { TRIPLET_ORIENTATION } from "./consts";

/**
 * Returns point ID based on coordinates. Uses ^P(\d{0,})-(\d{0,})$ regexp to parse coordinates.
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 */
export const pointID = (x: number | string, y: number | string): string =>
  `P${x}-${y}`;

export const pointsDistance = (point1: Point, point2: Point): number => {
  const x = point1.x - point2.x;
  const y = point1.y - point2.y;
  return Math.sqrt(x * x + y * y);
};

export const pointOnLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): boolean => {
  return (
    point.x >= Math.min(lineStart.x, lineEnd.x) &&
    point.x <= Math.max(lineStart.x, lineEnd.x) &&
    point.y >= Math.min(lineStart.y, lineEnd.y) &&
    point.y <= Math.max(lineStart.y, lineEnd.y)
  );
};

const closestPointIndex = (point: Point, points: Array<Point>): number => {
  let closestDistance = pointsDistance(point, points[0]);
  let closestIndex = 0;
  for (let i = 1; i < points.length; i++) {
    const distance = pointsDistance(point, points[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
};

export const tripletOrientation = (
  point1: Point,
  point2: Point,
  point3: Point
): TRIPLET_ORIENTATION => {
  const orientation =
    (point2.y - point1.y) * (point3.x - point2.x) -
    (point2.x - point1.x) * (point3.y - point2.y);

  if (orientation === 0) return TRIPLET_ORIENTATION.COLLINEAR;

  return orientation > 0
    ? TRIPLET_ORIENTATION.CLOCKWISE
    : TRIPLET_ORIENTATION.COUNTERCLOCKWISE;
};
