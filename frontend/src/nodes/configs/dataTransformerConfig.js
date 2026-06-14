import { Sigma } from 'lucide-react';

export const dataTransformerConfig = {
  title: "Data Transformer",
  type: "dataTransformer",
  icon: Sigma,
  width: 250,

  fields: [
    {
      name: "operation",
      label: "Operation",
      type: "select",
      defaultValue: "filter",
      options: ["filter", "map", "reduce", "sort"],
    },
    {
      name: "field_name",
      label: "Field Name",
      type: "text",
      defaultValue: "",
      placeholder: "e.g., age, name",
    },
    {
      name: "value",
      label: "Value / Expression",
      type: "text",
      defaultValue: "",
      placeholder: "e.g., >18, item * 2",
    },
  ],

  inputHandles: [{ id: "data", label: "Data" }],
  outputHandles: [{ id: "transformed_data", label: "Transformed Data" }],
};
