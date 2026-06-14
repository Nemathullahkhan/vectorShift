import { ArrowRightCircle } from 'lucide-react';

export const outputNodeConfig = {
  title: "Output",
  type: "customOutput",
  icon: ArrowRightCircle,
  width: 210,

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

  inputHandles: [{ id: "value", label: "Value" }],
  outputHandles: [],
};
