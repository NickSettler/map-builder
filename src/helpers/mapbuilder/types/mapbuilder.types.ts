import Line from "../line";
import Point from "../point";

export type MapBuilderOptions = {
  canvas: HTMLCanvasElement;
};

export type PointOptions = {
  id: string;
  x: number;
  y: number;
};

export type LineOptions = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ShapeLike = Line | Point;
