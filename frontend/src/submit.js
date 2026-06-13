// submit.js
import { useStore } from "./store";

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }));

  const handleSubmit = async () => {
    // Validate if the graph is empty or not
    if (nodes.length === 0) {
      alert("Please add some nodes to the graph before submitting.");
      return;
    }

    try {
      // Prepare the data to be sent to the backend
      const payload = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          id: edge.id,
        })),
      };
      // Make the API call to the backend
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Display the result in an alert
      const message = `
                    Pipeline Analysis:
                    ━━━━━━━━━━━━━━━━━━━━━━
                    Nodes: ${result.num_nodes}
                    Edges: ${result.num_edges}
                    Is DAG: ${result.is_dag ? "✓ Yes" : "✗ No"}
                    ━━━━━━━━━━━━━━━━━━━━━━
                    ${!result.is_dag ? "⚠️ Pipeline contains a cycle. Please fix it." : "✓ Pipeline is valid!"}
            `.trim();
      alert(message);
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={handleSubmit}>Execute Pipeline</button>
    </div>
  );
};
