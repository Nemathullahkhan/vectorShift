import { GitBranch } from 'lucide-react';

export const conditionConfig = {
  title: "Condition",
  type: "condition",
  icon: GitBranch,
  width: 240,

  fields: [
    {
      name: "condition",
      label: "Condition (JavaScript expression)",
      type: "textarea",
      defaultValue: "",
      placeholder: "e.g., x > 10 && y === 'active'",
    },
    {
      name: "true_label",
      label: "Output Label (True)",
      type: "text",
      defaultValue: "true",
      placeholder: "true",
    },
    {
      name: "false_label",
      label: "Output Label (False)",
      type: "text",
      defaultValue: "false",
      placeholder: "false",
    },
  ],

  inputHandles: [{ id: "value", label: "Value" }],
  outputHandles: [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ],
};
