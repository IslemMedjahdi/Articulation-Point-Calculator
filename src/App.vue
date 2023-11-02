<template>
  <div class="w-full flex justify-center">
    <network-graph-visualiser
      :graph="graph"
      :add-node="addNode"
      :add-edge="addEdge"
      :remove-node="removeNode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Graph } from "./entities/Graph";
import NetworkGraphVisualiser from "./components/NetworkGraphVisualiser.vue";

const graph = ref<Graph<string>>(new Graph());

const addNode = (value: string) => {
  graph.value.addNode(value);
};

const addEdge = (node1Id: string, node2Id: string) => {
  graph.value.addEdge(node1Id, node2Id);
};

const removeNode = (id: string) => {
  graph.value.removeNode(id);
};

watch(graph.value, (newGraph) => {
  newGraph.findArticulationPoints();
});
</script>
