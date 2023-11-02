<template>
  <div class="w-full flex justify-center">
    <div class="max-w-screen-lg p-4 w-full flex flex-col gap-y-2">
      <network-graph-visualiser
        :graph="graph"
        :add-node="addNode"
        :add-edge="addEdge"
        :remove-node="removeNode"
        :articulation-points="articulationPointsNodeIds"
      />
      <div class="bg-blue-50 text-sm px-4 py-2 border-blue-100 shadow-sm">
        <p class="underline">This work is done By:</p>
        <ul>
          <li>
            Islem Medjahdi
            <a
              href="mailto:ki_medjahdi@esi.dz"
              class="text-blue-600 hover:text-blue-700 hover:underline"
              >ki_medjahdi@esi.dz</a
            >
          </li>
          <li class="text-sm">
            Khaled Abderrahmene Habouche
            <a
              href="mailto:kk_habouche@esi.dz"
              class="text-blue-600 hover:text-blue-700 hover:underline"
              >kk_habouche@esi.dz</a
            >
          </li>
        </ul>
      </div>
    </div>
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
