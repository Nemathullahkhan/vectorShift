import { inputNodeConfig } from "./configs/inputNodeConfig";
import { outputNodeConfig } from "./configs/outputNodeConfig";
import { llmNodeConfig } from "./configs/llmNodeConfig";
import { textNodeConfig } from "./configs/textNodeConfig";
import { httpRequestConfig } from "./configs/httpRequestConfig";
import { filterNodeConfig } from "./configs/filterNodeConfig";
import { imageGeneratorConfig } from "./configs/imageGeneratorConfig";
import { webSearchConfig } from "./configs/webSearchConfig";
import { emailSenderConfig } from "./configs/emailSenderConfig";
import { dataTransformerConfig } from "./configs/dataTransformerConfig";
import { conditionConfig } from "./configs/conditionConfig";

export const nodeRegistry = {
  // Original 4
  customInput: inputNodeConfig,
  customOutput: outputNodeConfig,
  llm: llmNodeConfig,
  text: textNodeConfig,
  // New nodes
  httpRequest: httpRequestConfig,
  filter: filterNodeConfig,
  imageGenerator: imageGeneratorConfig,
  webSearch: webSearchConfig,
  emailSender: emailSenderConfig,
  dataTransformer: dataTransformerConfig,
  condition: conditionConfig,
};

/** Get config for a single node type */
export const getNodeConfig = (type) => nodeRegistry[type];

/** Get all registered type keys */
export const getAllNodeTypes = () => Object.keys(nodeRegistry);

/** Get all configs (useful for the node palette/toolbar) */
export const getAllConfigs = () => Object.values(nodeRegistry);
