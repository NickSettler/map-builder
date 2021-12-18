// create edge class with weight. edge connects two nodes.
import Point from "../mapbuilder/point";
import { pointID } from "../mapbuilder/pointsHelpers";

export class Edge {
  constructor(public node1: Node, public node2: Node, public weight: number) {
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
  }
}

// create a node class. two nodes are connected by an edge. one node can have multiple edges.
export class Node {
  private _edges: Edge[] = [];

  constructor(public name: string) {}

  // connect a node to another node with a weight
  public connect(node: Node, weight: number) {
    this._edges.push(new Edge(this, node, weight));
  }

  public connectedTo(node: Node) {
    return this._edges.some((edge) => edge.node2 === node);
  }

  // print all edges of a node
  public printEdges() {
    this._edges.forEach((edge) => {
      console.log(
        edge.node1.name + " -> " + edge.node2.name + " (" + edge.weight + ")"
      );
    });
  }

  // print edges with nodes recursively with offset
  public printEdgesRecursive(offset: number = 0) {
    if (offset > 5) return;
    this._edges.forEach((edge) => {
      console.log(
        " ".repeat(offset) +
          edge.node1.name +
          " -> " +
          edge.node2.name +
          " (" +
          edge.weight +
          ")"
      );
      edge.node2.printEdgesRecursive(offset + 2);
    });
  }

  get edges(): Edge[] {
    return this._edges;
  }
}

// create a graph class. graph has nodes and edges.
export class Graph {
  private _nodes: Node[] = [];

  // add a node to the graph
  public addNode(node: Node) {
    this._nodes.push(node);
  }

  // connect two nodes with a weight
  public connect(node1: Node, node2: Node, weight: number) {
    const node1Index = this._nodes.findIndex(
      (node) => node.name === node1.name
    );
    const node2Index = this._nodes.findIndex(
      (node) => node.name === node2.name
    );
    this._nodes[node1Index].connect(this._nodes[node2Index], weight);
  }

  // get all the nodes in the graph
  public getNodes() {
    return this._nodes;
  }

  public containsNode(node: Node) {
    return this._nodes.findIndex((n) => n.name === node.name) !== -1;
  }

  public findNode(name: string) {
    return this._nodes.find((node) => node.name === name);
  }

  public optimize() {
    // remove duplicate edges
    this._nodes.forEach((node) => {
      node.edges.forEach((edge, index) => {
        node.edges.forEach((edge2, index2) => {
          if (
            index !== index2 &&
            edge.node1.name === edge2.node1.name &&
            edge.node2.name === edge2.node2.name
          ) {
            node.edges.splice(index2, 1);
          }
        });
      });
    });
  }

  get nodes(): Array<Node> {
    return this._nodes;
  }
}

// create a heuristic function to calculate the distance between two nodes using weights
export function heuristic(node1: Node, node2: Node) {
  return node1.edges.find((edge) => edge.node2.name === node2.name)?.weight!;
}

const reconstructPath = (cameFrom: Map<Node, Node>, current: Node) => {
  const totalPath: Node[] = [];
  totalPath.unshift(current);
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    totalPath.unshift(current);
  }
  return totalPath;
};

// create pathfinding a* algorithm using Node and Edge class
export function pathfindingAStar(graph: Graph, start: Node, end: Node) {
  const discovered: Set<Node> = new Set([start]);

  const cameFrom: Map<Node, Node> = new Map();

  const gScore: Map<Node, number> = new Map();
  gScore.set(start, 0);

  const fScore: Map<Node, number> = new Map();
  fScore.set(start, heuristic(start, end));

  while (discovered.size > 0) {
    const current: Node = discovered.values().next().value;

    if (current === end) {
      return reconstructPath(cameFrom, current);
    }

    discovered.delete(current);
    current.edges.forEach((edge: Edge) => {
      const neighbor = edge.node2;

      const tentativeGScore = gScore.get(current)! + edge.weight;
      if (tentativeGScore < gScore.get(neighbor)! || !gScore.has(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
        if (!discovered.has(neighbor)) {
          discovered.add(neighbor);
        }
      }
    });
  }
}

export const nodeToPoint = (node: Node) => {
  const regex = /^P(?<x>\d*)-(?<y>\d*)$/;

  const match = regex.exec(node.name);

  if (!(match && match.groups)) return false;

  const { x, y } = match.groups;

  return new Point({
    id: pointID(x, y),
    x: parseInt(x),
    y: parseInt(y),
  });
};
