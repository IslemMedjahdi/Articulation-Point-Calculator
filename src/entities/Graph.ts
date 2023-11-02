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

  dfs(startNodeId: string, visitCallback: (node: Node<T>) => void) {
    const visitedNodes: Set<string> = new Set();
    const startNode = this.nodes.find((node) => node.getId() === startNodeId);

    if (!startNode) {
      throw new Error("Invalid start node ID");
    }

    const dfsRecursive = (node: Node<T>) => {
      visitedNodes.add(node.getId());
      visitCallback(node);

      for (const neighbor of node.getEdges()) {
        if (!visitedNodes.has(neighbor.getId())) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startNode);
  }

  findArticulationPoints() {
    const articulationPoints: Node<T>[] = [];

    const cloneGraph = this.clone();

    cloneGraph.getNodes().forEach(async (node) => {
      // Iterating over all the noes and for each node
      // remove the node and check whether the graph remains
      // connected.
      cloneGraph.removeNode(node.getId());

      // To keep track of number of components of graph
      let components = 0;

      // To keep track of visited vertices
      const visited = new Set<string>();

      cloneGraph.getNodes().forEach((node) => {
        if (!visited.has(node.getId())) {
          cloneGraph.dfs(node.getId(), (visitedNode) => {
            visited.add(visitedNode.getId());
          });
          components++;
        }
      });

      // If number of components is more than 1 after
      // removing the node then the node is an
      // articulation point.
      if (components > 1) {
        articulationPoints.push(node);
      }

      // Add the node back to the graph
      cloneGraph.addNode(node.getValue(), node.getId());
      node.getEdges().forEach((edge) => {
        cloneGraph.addEdge(node.getId(), edge.getId());
      });
    });

    return articulationPoints;
  }

  private clone(): Graph<T> {
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
