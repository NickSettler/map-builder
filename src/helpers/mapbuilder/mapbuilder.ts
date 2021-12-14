import { MapBuilderOptions, ShapeLike } from "./types/mapbuilder.types";
import Point from "./point";
import Line from "./line";
import { MAP_MODES } from "./consts";
import EventEmitter from "events";
import { v4 } from "uuid";
import { Graph, Node } from "../graph/graph";
import { connected, intersect, splitIntersection } from "./linesHelpers";

interface MapBuilderEvents {
  mode_change: (mode: MAP_MODES) => void;
  selection_change: (selection: ShapeLike | false) => void;
}

interface MapBuilder {
  on<U extends keyof MapBuilderEvents>(
    event: U,
    listener: MapBuilderEvents[U]
  ): this;

  emit<U extends keyof MapBuilderEvents>(
    event: U,
    ...args: Parameters<MapBuilderEvents[U]>
  ): boolean;
}

class MapBuilder extends EventEmitter {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private _width: number = 600;
  private _height: number = 400;

  private _mouseX: number = 0;
  private _mouseY: number = 0;

  private _lastTime: number = 0;

  private _currentMode: MAP_MODES;

  private _points: Point[];
  private _lines: Line[];

  private _currentAdd: number = 0;
  private _firstAddPoint: Point;
  private _secondAddPoint: Point;

  constructor(options: MapBuilderOptions) {
    super();

    this._canvas = options.canvas;
    this._context = this._canvas.getContext("2d")!;
    this._canvas.width = this._width;
    this._canvas.height = this._height;

    this._currentMode = MAP_MODES.NORMAL;

    this._points = [];
    this._lines = [];

    this._firstAddPoint = new Point({
      id: v4(),
      x: 0,
      y: 0,
    });
    this._secondAddPoint = new Point({
      id: v4(),
      x: 0,
      y: 0,
    });

    // const g = new Graph();
    // g.addNode(new Node(1));
    // g.addNode(new Node(2));
    // g.nodes[0].connect(g.nodes[1], 10);
    //
    // g.print();

    const g = new Graph();
    const n1 = new Node("aa");
    const n2 = new Node("bb");
    const n3 = new Node("cc");

    g.addNode(n1);
    g.addNode(n2);
    g.addNode(n3);

    n1.connect(n2, 10);
    n1.connect(n3, 20);
    n2.connect(n3, 15);

    // n1.printEdgesRecursive();

    // console.log(pathfindingAStar(g, n1, n3));

    const l1 = new Line({
      id: v4(),
      x1: 0,
      y1: 50,
      x2: 200,
      y2: 50,
    });

    const l2 = new Line({
      id: v4(),
      x1: 150,
      y1: 0,
      x2: 150,
      y2: 100,
    });

    this._lines.push(l1);
    this._lines.push(l2);

    // const sI = splitIntersection(l1, l2);
    //
    // if (sI) {
    //   this._lines = this._lines.filter((l) => l.id !== l1.id && l.id !== l2.id);
    //   this._lines.push(...sI);
    // }

    const l3 = new Line({
      id: v4(),
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 100,
    });

    const l4 = new Line({
      id: v4(),
      x1: 300,
      y1: 300,
      x2: 300,
      y2: 400,
    });

    const l5 = new Line({
      id: v4(),
      x1: 300,
      y1: 350,
      x2: 300,
      y2: 500,
    });

    console.log(connected(l4, l5));
    console.log(intersect(l4, l5));

    this._lines.push(l3);

    this.processIntersections();

    // create graph from lines
    // const g2 = new Graph();
    // this._lines.forEach((l: Line) => {
    //   const n1 = new Node(l.id);
    //
    //   if (!g2.containsNode(n1)) {
    //     g2.addNode(n1);
    //   } else {
    //     const n1 = g2.findNode(l.id);
    //   }
    // });
  }

  public start() {
    this.tick(0);
  }

  public addShape(shape: ShapeLike) {
    if (shape instanceof Point) {
      this._points.push(shape);
    } else if (shape instanceof Line) {
      this._lines.push(shape);
    }

    this.processIntersections();
  }

  public updateShape(shape: ShapeLike) {
    if (shape instanceof Point) {
      const index = this._points.findIndex((p: Point) => p.id === shape.id);
      if (index !== -1) {
        this._points[index] = shape;
      } else {
        this.addShape(shape);
      }
    } else if (shape instanceof Line) {
      const index = this._lines.findIndex((l: Line) => l.id === shape.id);
      if (index !== -1) {
        this._lines[index] = shape;
      } else {
        this.addShape(shape);
      }
    }
  }

  public selectShape(shape: ShapeLike) {
    let wasSelected = shape.selected;

    this._points.forEach((p: Point) => {
      p.selected = p.id === shape.id ? !p.selected : false;
    });

    this._lines.forEach((l: Line) => {
      l.selected = l.id === shape.id ? !l.selected : false;
    });

    this.emit("selection_change", wasSelected ? false : shape);
  }

  public setMode(mode: MAP_MODES) {
    this._currentMode = mode;
    this.emit("mode_change", mode);
  }

  private processIntersections() {
    let intersections: Array<Point> = [];

    for (let i = 0; i < this._lines.length; i++) {
      for (let j = 0; j < this._lines.length; j++) {
        const intersectionPoint = intersect(this._lines[i], this._lines[j]);
        const linesConnected = connected(this._lines[i], this._lines[j]);

        if (intersectionPoint && !linesConnected) {
          intersections.push(intersectionPoint);
        }
      }
    }

    if (intersections.length > 0) {
      for (let i = 0; i < this._lines.length; i++) {
        let intersectionFound = false;
        for (let j = 0; j < this._lines.length; j++) {
          const sI = splitIntersection(this._lines[i], this._lines[j]);

          if (sI && !connected(this._lines[i], this._lines[j])) {
            intersectionFound = true;

            this._lines = this._lines.filter(
              (l) => l.id !== this._lines[i].id && l.id !== this._lines[j].id
            );
            this._lines.push(...sI);

            break;
          }
        }

        if (intersectionFound) {
          break;
        }
      }

      this.processIntersections();
    }
  }

  private update() {
    if (this._currentMode === MAP_MODES.ADD) {
      this._firstAddPoint.x = this._mouseX;
      this._firstAddPoint.y = this._mouseY;
    }
  }

  private render() {
    this._lines.forEach((line) => {
      line.render(this._context);
    });

    this._points.forEach((point) => {
      point.render(this._context);
    });

    if (this.selectedShape instanceof Point) {
      this.selectedShape.render(this._context);
    } else if (this.selectedShape instanceof Line) {
      this.selectedShape.render(this._context);
    }

    if (this._currentMode === MAP_MODES.ADD) {
      if (this._currentAdd === 0) {
        this._firstAddPoint.render(this._context);
      } else {
        this._secondAddPoint.render(this._context);
      }
    }
  }

  private tick(t: number) {
    this._lastTime = t;
    this._context.clearRect(0, 0, this._width, this._height);

    this.update();
    this.render();

    requestAnimationFrame(this.tick.bind(this));
  }

  get mode() {
    return this._currentMode;
  }

  get points() {
    return this._points;
  }

  get lines() {
    return this._lines;
  }

  get selectedShape(): ShapeLike | false {
    return (
      this._points.find((p) => p.selected) ||
      this._lines.find((l) => l.selected) ||
      false
    );
  }

  set mouseX(x: number) {
    this._mouseX = x;
  }

  get mouseX() {
    return this._mouseX;
  }

  set mouseY(y: number) {
    this._mouseY = y;
  }

  get mouseY() {
    return this._mouseY;
  }
}

export default MapBuilder;
