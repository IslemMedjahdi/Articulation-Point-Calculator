<template>
  <div class="w-full flex justify-center">
    <network-graph-visualiser
      :graph="graph"
      :add-node="addNode"
      :add-edge="addEdge"
      :remove-node="removeNode"
      :articulation-points="articulationPointsNodeIds"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Graph } from "./entities/Graph";
import NetworkGraphVisualiser from "./components/NetworkGraphVisualiser.vue";
import { GraphUtils } from "./utils/GraphUtils";

const graph = ref<Graph<string>>(new Graph());

const articulationPointsNodeIds = computed<string[]>(() => {
  return GraphUtils.findArticulationPoints(graph.value as Graph<string>).map(
    (node) => node.getId()
  );
});

const addNode = (value: string) => {
  graph.value.addNode(value);
};

const addEdge = (node1Id: string, node2Id: string) => {
  graph.value.addEdge(node1Id, node2Id);
};

const removeNode = (id: string) => {
  graph.value.removeNode(id);
};
</script>
