import { inputNodeConfig } from "./configs/inputNodeConfig";
import { outputNodeConfig } from "./configs/outputNodeConfig";
import { llmNodeConfig } from "./configs/llmNodeConfig";
import { textNodeConfig } from "./configs/textNodeConfig";
import { manualTriggerConfig } from "./configs/manualTriggerConfig";
import { httpRequestConfig } from "./configs/httpRequestConfig";
import { mathNodeConfig } from "./configs/mathNodeConfig";
import { filterNodeConfig } from "./configs/filterNodeConfig";
import { delayNodeConfig } from "./configs/delayNodeConfig";

export const nodeRegistry = {
  // Original 4
  customInput: inputNodeConfig,
  customOutput: outputNodeConfig,
  llm: llmNodeConfig,
  text: textNodeConfig,
  // New 5
  manualTrigger: manualTriggerConfig,
  httpRequest: httpRequestConfig,
  math: mathNodeConfig,
  filter: filterNodeConfig,
  delay: delayNodeConfig,
};

/** Get config for a single node type */
export const getNodeConfig = (type) => nodeRegistry[type];

/** Get all registered type keys */
export const getAllNodeTypes = () => Object.keys(nodeRegistry);

/** Get all configs (useful for the node palette/toolbar) */
export const getAllConfigs = () => Object.values(nodeRegistry);
