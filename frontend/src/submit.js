import { useStore } from "./store";
import { Button } from "./components/ui/button";

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }));

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert("Please add some nodes to the graph before submitting.");
      return;
    }

    try {
      const payload = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          id: edge.id,
        })),
      };

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

      const message = `Pipeline Analysis:\n━━━━━━━━━━━━━━━━━━━━━━\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nIs DAG: ${result.is_dag ? "✓ Yes" : "✗ No"}\n━━━━━━━━━━━━━━━━━━━━━━\n${!result.is_dag ? "⚠️ Pipeline contains a cycle. Please fix it." : "✓ Pipeline is valid!"}`;
      alert(message);
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={handleSubmit}
        variant="default"
        className="px-6 py-3 font-semibold"
      >
        Execute Pipeline
      </Button>
    </div>
  );
};
