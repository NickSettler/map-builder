import Point from "./point";
import { LineOptions } from "./types/mapbuilder.types";
import { selectedColor, unselectedColor } from "./consts";
import { v4 } from "uuid";

export default class Line {
  private _id: string;
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  private _selected: boolean;

  constructor(options: LineOptions) {
    this._id = options.id;
    this.x1 = options.x1;
    this.y1 = options.y1;
    this.x2 = options.x2;
    this.y2 = options.y2;
    this._selected = false;
  }

  public update(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = this._selected ? selectedColor : unselectedColor;
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
  }

  get id() {
    return this._id;
  }

  set X1(x1: number) {
    this.x1 = x1;
  }

  get X1() {
    return this.x1;
  }

  set Y1(y1: number) {
    this.y1 = y1;
  }

  get Y1() {
    return this.y1;
  }

  set X2(x2: number) {
    this.x2 = x2;
  }

  get X2() {
    return this.x2;
  }

  set Y2(y2: number) {
    this.y2 = y2;
  }

  get Y2() {
    return this.y2;
  }

  get point1() {
    return new Point({ id: v4(), x: this.x1, y: this.y1 });
  }

  get point2() {
    return new Point({ id: v4(), x: this.x2, y: this.y2 });
  }

  get length() {
    return Math.sqrt(
      Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)
    );
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get selected() {
    return this._selected;
  }
}
