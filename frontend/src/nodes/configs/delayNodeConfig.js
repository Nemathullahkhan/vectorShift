export const delayNodeConfig = {
  title: "Delay",
  type: "delay",
  width: 210,
  bgColor: "#fff1f2",
  borderColor: "#f43f5e",
  titleColor: "#be123c",

  fields: [
    {
      name: "duration",
      label: "Duration",
      type: "text",
      defaultValue: "1000",
      placeholder: "milliseconds",
    },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      defaultValue: "milliseconds",
      options: ["milliseconds", "seconds", "minutes"],
    },
  ],

  inputHandles: [{ id: "input", label: "Input", color: "#f43f5e" }],
  outputHandles: [{ id: "output", label: "Output", color: "#f43f5e" }],
};
