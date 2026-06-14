// nodes/configs/outputNodeConfig.js

export const outputNodeConfig = {
  title: "Output",
  type: "customOutput",
  width: 210,
  bgColor: "#faf5ff",
  borderColor: "#9333ea",
  titleColor: "#7e22ce",

  fields: [
    {
      name: "outputName",
      label: "Name",
      type: "text",
      defaultValue: "output_1",
      placeholder: "Variable name",
    },
    {
      name: "outputType",
      label: "Type",
      type: "select",
      defaultValue: "Text",
      options: ["Text", "Image", "File", "JSON"],
    },
  ],

  inputHandles: [{ id: "value", label: "Value", color: "#9333ea" }],
  outputHandles: [],
};
