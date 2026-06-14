export const filterNodeConfig = {
  title: "Filter",
  type: "filter",
  width: 220,
  bgColor: "#eef2ff",
  borderColor: "#6366f1",
  titleColor: "#4338ca",

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

  inputHandles: [{ id: "input", label: "Input", color: "#6366f1" }],
  outputHandles: [
    { id: "true", label: "True", color: "#16a34a" },
    { id: "false", label: "False", color: "#ef4444" },
  ],
};
