import { BaseNode } from "./baseNode";
import { getNodeConfig } from "./nodeRegistry";

export const Node = ({ id, data, type }) => {
  const config = getNodeConfig(type);

  if (!config) {
    return (
      <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-3 text-sm text-red-700">
        <strong>Unknown node type:</strong> {type}
      </div>
    );
  }

  return <BaseNode id={id} data={data} config={config} />;
};
