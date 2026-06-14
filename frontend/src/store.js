import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import { getNodeConfig } from "./nodes/nodeRegistry";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  nodeCounters: {},

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  getNextNodeName: (type, baseTitle) => {
    const counters = get().nodeCounters;
    const currentCount = counters[type] || 0;
    const nextCount = currentCount + 1;

    set({
      nodeCounters: {
        ...counters,
        [type]: nextCount,
      },
    });

    return `${baseTitle.replace(/ /g, "_")}_${nextCount}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
        },
        get().edges,
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node,
      ),
    });
  },

  updateNodeDynamicHandles: (nodeId, dynamicHandles) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, dynamicInputHandles: dynamicHandles } }
          : node,
      ),
    });
  },

  getNodeOutputFields: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return [];

    const config = getNodeConfig(node.type);
    return config?.outputHandles || [];
  },

  getAllNodeNames: () => {
    return get().nodes.map((node) => ({
      id: node.id,
      name: node.data?.nodeName || node.type,
      type: node.type,
    }));
  },

  syncVariableEdges: (nodeId, dynamicHandles) => {
    const { nodes, edges } = get();

    // Remove all previously auto-generated edges targeting this node's dynamic handles
    const baseEdges = edges.filter(
      (edge) => !(edge.target === nodeId && edge.id?.startsWith("auto-var-")),
    );

    const newEdges = [];
    for (const handle of dynamicHandles) {
      const sourceNode = nodes.find(
        (n) => n.data?.nodeName === handle.originalNodeName,
      );
      if (!sourceNode) continue;

      const edgeId = `auto-var-${sourceNode.id}-${nodeId}-${handle.id}`;
      newEdges.push({
        id: edgeId,
        source: sourceNode.id,
        sourceHandle: `${sourceNode.id}-output-${handle.originalFieldName}`,
        target: nodeId,
        targetHandle: `${nodeId}-input-${handle.id}`,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
      });
    }

    set({ edges: [...baseEdges, ...newEdges] });
  },
}));
