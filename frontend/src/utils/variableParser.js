/**
 * Variable Parser Utility
 * Handles extracting and validating {{NodeName.FieldName}} variables
 */

/**
 * Extract all variables from text content
 * @param {string} text - The text to parse
 * @returns {Array<{nodeName: string, fieldName: string, fullMatch: string}>}
 */
export const extractVariables = (text) => {
  if (!text || typeof text !== "string") return [];

  const regex =
    /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      nodeName: match[1],
      fieldName: match[2],
      fullMatch: match[0],
    });
  }

  // Deduplicate by nodeName.fieldName combination
  const unique = [];
  const seen = new Set();

  for (const variable of matches) {
    const key = `${variable.nodeName}.${variable.fieldName}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(variable);
    }
  }

  return unique;
};

/**
 * Validate a variable against current canvas nodes
 * @param {Object} variable - {nodeName, fieldName}
 * @param {Array} nodes - Current nodes from store
 * @param {Function} getNodeConfig - Function to get node config by type
 * @returns {Object} {isValid, errorMessage}
 */
export const validateVariable = (variable, nodes, getNodeConfig) => {
  const { nodeName, fieldName } = variable;

  // Find node by name
  const targetNode = nodes.find((node) => node.data?.nodeName === nodeName);

  if (!targetNode) {
    return {
      isValid: false,
      errorMessage: `Node "${nodeName}" not found`,
    };
  }

  // Get node config to check output fields
  const config = getNodeConfig(targetNode.type);

  if (!config || !config.outputHandles) {
    return {
      isValid: false,
      errorMessage: `Node "${nodeName}" has no output fields`,
    };
  }

  const fieldExists = config.outputHandles.some(
    (handle) => handle.id === fieldName,
  );

  if (!fieldExists) {
    const availableFields = config.outputHandles.map((h) => h.id).join(", ");
    return {
      isValid: false,
      errorMessage: `Field "${fieldName}" not found. Available: ${availableFields}`,
    };
  }

  return { isValid: true, errorMessage: null };
};

/**
 * Validate all variables in text
 * @param {string} text - Text containing variables
 * @param {Array} nodes - Current nodes from store
 * @param {Function} getNodeConfig - Function to get node config by type
 * @returns {Object} {validVariables, invalidVariables, hasErrors}
 */
export const validateAllVariables = (text, nodes, getNodeConfig) => {
  const variables = extractVariables(text);
  const validVariables = [];
  const invalidVariables = [];

  for (const variable of variables) {
    const validation = validateVariable(variable, nodes, getNodeConfig);
    if (validation.isValid) {
      validVariables.push(variable);
    } else {
      invalidVariables.push({
        ...variable,
        errorMessage: validation.errorMessage,
      });
    }
  }

  return {
    validVariables,
    invalidVariables,
    hasErrors: invalidVariables.length > 0,
  };
};
