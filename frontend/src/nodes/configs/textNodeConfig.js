import { Type } from 'lucide-react';

export const textNodeConfig = {
  title: "Text",
  type: "text",
  icon: Type,
  width: 250,

  fields: [
    {
      name: "text",
      label: "Text",
      type: "textarea",
      defaultValue: "",
      placeholder: "Enter text... Use {{NodeName.field}} for variables",
    },
  ],

  inputHandles: [],
  outputHandles: [{ id: "output", label: "Output" }],
};
