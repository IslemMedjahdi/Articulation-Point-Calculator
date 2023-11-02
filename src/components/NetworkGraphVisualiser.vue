<template>
  <div class="max-w-screen-lg w-full p-4 flex flex-col gap-2">
    <div class="flex justify-center">
      <p class="font-serif text-2xl font-medium">
        Articulation Point Calculator
      </p>
    </div>
    <el-alert title="To select multiple edges, Shift+click" type="info" />
    <div class="flex items-center flex-wrap gap-2 bg-blue-50 px-4 py-2">
      <div class="flex items-center gap-2 w-fit">
        <label>Node:</label>
        <el-input v-model="newNodeValue" placeholder="Node Value" />
        <el-button type="primary" plain @click="onAddNode">Add Node</el-button>
        <el-button
          type="primary"
          plain
          @click="onRemoveNodes"
          :disabled="selectedNodes.length === 0"
          >Remove Selected Nodes</el-button
        >
      </div>
      <div class="flex items-center gap-2 w-fit">
        <label>Edge:</label>
        <el-button
          type="primary"
          plain
          :disabled="selectedNodes.length != 2"
          @click="onAddEdge"
          >add</el-button
        >
      </div>
    </div>
    <div class="w-full h-96 border-blue-100 border-2">
      <v-network-graph
        :configs="configs"
        :nodes="nodes"
        :edges="edges"
        v-model:selected-nodes="selectedNodes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import { VNetworkGraph, defineConfigs } from "v-network-graph";
import "v-network-graph/lib/style.css";
import type { Graph } from "@/entities/Graph";
import type { Edges, Nodes } from "v-network-graph";

type Props = {
  graph: Graph<string>;
  addNode: (value: string) => void;
  removeNode: (id: string) => void;
  addEdge: (from: string, to: string) => void;
};
const props = defineProps<Props>();

const nodes = ref<Nodes>({});
const edges = ref<Edges>({});

watch(props.graph, (newGraph) => {
  nodes.value = {};
  edges.value = {};

  newGraph.getNodes().forEach((node) => {
    nodes.value[node.getId()] = {
      name: node.getValue(),
    };
  });

  newGraph.getEdges().forEach((edge) => {
    const [source, target] = edge;
    edges.value[`${source.getId()}-${target.getId()}`] = {
      source: source.getId(),
      target: target.getId(),
    };
  });
});

const newNodeValue = ref("");

const onAddNode = () => {
  props.addNode(newNodeValue.value);
  newNodeValue.value = "";
};

const onRemoveNodes = () => {
  selectedNodes.value.forEach((nodeId) => {
    delete nodes.value[nodeId];
    props.removeNode(nodeId);
  });

  selectedNodes.value = [];
};

const onAddEdge = () => {
  if (selectedNodes.value.length === 2) {
    const [source, target] = selectedNodes.value;
    props.addEdge(source, target);
  }
};

const selectedNodes = ref<string[]>([]);

const configs = defineConfigs({
  node: { selectable: true },
});
</script>