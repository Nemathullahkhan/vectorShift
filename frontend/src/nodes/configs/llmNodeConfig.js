export const llmNodeConfig = {
  title: "LLM",
  type: "llm",
  width: 230,
  bgColor: "#fff7ed",
  borderColor: "#f97316",
  titleColor: "#c2410c",

  fields: [
    {
      name: "model",
      label: "Model",
      type: "select",
      defaultValue: "gpt-3.5-turbo",
      options: ["gpt-3.5-turbo", "gpt-4", "claude-3-sonnet", "gemini-pro"],
    },
    
      {
      name: "text",
      label: "Text",
      type: "textarea", // Important: Use textarea for auto-resize
      defaultValue: "",
      placeholder: "Enter text... Use {{NodeName.field}} for variables",
    },

  ],

  inputHandles: [
    { id: "system", label: "System", color: "#f97316" },
    { id: "prompt", label: "Prompt", color: "#f97316" },
  ],
  outputHandles: [{ id: "response", label: "Response", color: "#f97316" }],
};
