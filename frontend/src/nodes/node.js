import { BaseNode } from "./baseNode";
import { getNodeConfig } from "./nodeRegistry";

export const Node = ({ id, data, type }) => {
  const config = getNodeConfig(type);

  if (!config) {
    return (
      <div
        style={{
          padding: "10px",
          border: "2px solid #ef4444",
          borderRadius: "8px",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "12px",
        }}
      >
        <strong>Unknown node type:</strong> {type}
      </div>
    );
  }

  return <BaseNode id={id} data={data} config={config} />;
};
