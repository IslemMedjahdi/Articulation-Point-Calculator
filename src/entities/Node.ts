import { v4 as uuid } from "uuid";

export class Node<T> {
  private id: string;
  private value: T;
  private edges: Node<T>[];

  constructor(value: T, id: string = uuid()) {
    this.id = id;
    this.value = value;
    this.edges = [];
  }

  addEdge(node: Node<T>) {
    const existingNode = this.edges.find(
      (edge) => edge.getId() === node.getId()
    );
    if (existingNode) {
      return;
    }
    this.edges.push(node);
  }

  removeEdge(node: Node<T>) {
    this.edges = this.edges.filter((edge) => edge !== node);
  }

  getEdges() {
    return this.edges;
  }

  getValue() {
    return this.value;
  }

  getId() {
    return this.id;
  }
}
