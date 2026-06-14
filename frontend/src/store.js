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

    return `${baseTitle} ${nextCount}`;
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
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  updateNodeDynamicHandles: (nodeId, dynamicHandles) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            dynamicInputHandles: dynamicHandles,
          };
        }
        return node;
      }),
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
}));
