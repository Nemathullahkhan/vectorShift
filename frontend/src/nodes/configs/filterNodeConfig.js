import { Filter } from 'lucide-react';

export const filterNodeConfig = {
  title: "Filter",
  type: "filter",
  icon: Filter,
  width: 220,

  fields: [
    {
      name: "operator",
      label: "Operator",
      type: "select",
      defaultValue: "equals",
      options: [
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "contains",
        "matches_regex",
      ],
    },
    {
      name: "compareValue",
      label: "Compare With",
      type: "text",
      defaultValue: "",
      placeholder: "Value to compare",
    },
  ],

  inputHandles: [{ id: "input", label: "Input" }],
  outputHandles: [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ],
};
