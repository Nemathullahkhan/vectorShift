import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { Node } from "./nodes/node";
import { getAllNodeTypes } from "./nodes/nodeRegistry";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Build nodeTypes map from registry: { customInput: Node, llm: Node, ... }
const nodeTypes = getAllNodeTypes().reduce((acc, type) => {
  acc[type] = Node;
  return acc;
}, {});

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event?.dataTransfer?.getData("application/reactflow");
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      });
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: "100vw", height: "70vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#e2e8f0" gap={gridSize} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
