import { PointOptions } from "./types/mapbuilder.types";
import { selectedColor, unselectedColor } from "./consts";

export default class Point {
  private _id: string;
  private _x: number;
  private _y: number;
  private _selected: boolean;

  constructor(options: PointOptions) {
    this._id = options.id;
    this._x = options.x;
    this._y = options.y;
    this._selected = false;
  }

  public update(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this._selected ? selectedColor : unselectedColor;
    ctx.arc(this._x, this._y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  get id(): string {
    return this._id;
  }

  set x(x: number) {
    this._x = x;
  }

  get x(): number {
    return this._x;
  }

  set y(y: number) {
    this._y = y;
  }

  get y(): number {
    return this._y;
  }

  set selected(selected: boolean) {
    this._selected = selected;
  }

  get selected(): boolean {
    return this._selected;
  }
}
