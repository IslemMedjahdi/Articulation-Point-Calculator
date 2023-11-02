import { Node } from "../entities/Node";
import { Graph } from "../entities/Graph";

export class GraphUtils {
  static dfs<T>(
    graph: Graph<T>,
    startNodeId: string,
    visitCallback: (node: Node<T>) => void
  ) {
    const visitedNodes: Set<string> = new Set();
    const startNode = graph
      .getNodes()
      .find((node) => node.getId() === startNodeId);

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

  static findArticulationPoints<T>(graph: Graph<T>) {
    const articulationPoints: Node<T>[] = [];

    const cloneGraph = graph.clone();

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
          GraphUtils.dfs(cloneGraph, node.getId(), (visitedNode) => {
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
}
