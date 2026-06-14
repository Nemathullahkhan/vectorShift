export const textNodeConfig = {
  title: "Text",
  type: "text",
  width: 250,
  bgColor: "#f0fdf4",
  borderColor: "#22c55e",
  titleColor: "#166534",

  fields: [
    {
      name: "text",
      label: "Text",
      type: "textarea", // Important: Use textarea for auto-resize
      defaultValue: "",
      placeholder: "Enter text... Use {{NodeName.field}} for variables",
    },
  ],

  inputHandles: [], // Will be populated dynamically from variables
  outputHandles: [{ id: "output", label: "Output", color: "#22c55e" }],
};
