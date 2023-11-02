import { Node } from "./Node";

export class Graph<T> {
  private nodes: Node<T>[];

  constructor() {
    this.nodes = [];
  }

  addNode(value: T, id?: string) {
    const newNode = new Node(value, id);
    this.nodes.push(newNode);
    return newNode;
  }

  addEdge(node1Id: string, node2Id: string) {
    const node1 = this.nodes.find((node) => node.getId() === node1Id);
    const node2 = this.nodes.find((node) => node.getId() === node2Id);

    if (!node1 || !node2) {
      throw new Error("Invalid node IDs");
    }
    node1.addEdge(node2);
    node2.addEdge(node1);
  }

  getNodes() {
    return this.nodes;
  }

  getEdges(): [Node<T>, Node<T>][] {
    const edges: [Node<T>, Node<T>][] = [];

    this.nodes.forEach((node) => {
      node.getEdges().forEach((edge) => {
        const alreadyAdded = edges.some(([node1, node2]) => {
          return (
            (node1.getId() === node.getId() &&
              node2.getId() === edge.getId()) ||
            (node2.getId() === node.getId() && node1.getId() === edge.getId())
          );
        });
        if (!alreadyAdded) {
          edges.push([node, edge]);
        }
      });
    });

    return edges;
  }

  removeNode(nodeId: string) {
    const nodeToRemove = this.nodes.find((node) => node.getId() === nodeId);
    if (!nodeToRemove) {
      throw new Error("Invalid node ID");
    }

    this.nodes = this.nodes.filter((node) => node.getId() !== nodeId);

    this.nodes.forEach((node) => {
      node.removeEdge(nodeToRemove);
    });
  }

  clone(): Graph<T> {
    const cloneGraph = new Graph<T>();
    this.nodes.forEach((node) => {
      cloneGraph.addNode(node.getValue(), node.getId());
    });

    this.getEdges().forEach(([node1, node2]) => {
      cloneGraph.addEdge(node1.getId(), node2.getId());
    });

    return cloneGraph;
  }
}
