// create edge class with weight. edge connects two nodes.
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
  private nodes: Node[] = [];

  // add a node to the graph
  public addNode(node: Node) {
    this.nodes.push(node);
  }

  // connect two nodes with a weight
  public connect(node1: Node, node2: Node, weight: number) {
    const node1Index = this.nodes.findIndex((node) => node.name === node1.name);
    const node2Index = this.nodes.findIndex((node) => node.name === node2.name);
    this.nodes[node1Index].connect(this.nodes[node2Index], weight);
  }

  // get all the nodes in the graph
  public getNodes() {
    return this.nodes;
  }

  public containsNode(node: Node) {
    return this.nodes.findIndex((n) => n.name === node.name) !== -1;
  }

  public findNode(name: string) {
    return this.nodes.find((node) => node.name === name);
  }

  public optimize() {
    // remove duplicate edges
    this.nodes.forEach((node) => {
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
}

// create pathfinding function using Node and Edge class
export function pathfinding(graph: Graph, start: Node, end: Node) {
  const startNode = graph.getNodes().find((node) => node.name === start.name)!;
  const endNode = graph.getNodes().find((node) => node.name === end.name);

  // create a queue to store nodes
  const queue: Node[] = [];

  // add start node to queue
  queue.push(startNode);

  // create a set to store visited nodes
  const visited: Set<Node> = new Set();

  // create a set to store nodes in the queue
  const inQueue: Set<Node> = new Set();

  // create a set to store nodes in the path
  const path: Set<Node> = new Set();

  // while queue is not empty
  while (queue.length > 0) {
    // get the first node in the queue
    const currentNode = queue.shift()!;

    // if current node is the end node, return the path
    if (currentNode === endNode) {
      path.add(currentNode);
      return path;
    }

    // add current node to visited set
    visited.add(currentNode);

    // add current node to path set
    path.add(currentNode);

    // get all edges of current node
    const edges = currentNode.edges;

    // for each edge
    edges.forEach((edge) => {
      // if edge is not in visited set
      if (!visited.has(edge.node2)) {
        // add edge.node2 to queue
        queue.push(edge.node2);
      }
    });

    // add current node to in queue set
    inQueue.add(currentNode);
  }

  // if end node is not in visited set, return empty set
  return new Set();
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
