import { Cpu } from 'lucide-react';

export const llmNodeConfig = {
  title: "LLM",
  type: "llm",
  icon: Cpu,
  width: 230,

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
      type: "textarea",
      defaultValue: "",
      placeholder: "Enter text... Use {{NodeName.field}} for variables",
    },
  ],

  inputHandles: [
    { id: "system", label: "System" },
    { id: "prompt", label: "Prompt" },
  ],
  outputHandles: [{ id: "response", label: "Response" }],
};
