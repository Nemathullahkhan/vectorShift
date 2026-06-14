import { Cloud } from 'lucide-react';

export const httpRequestConfig = {
  title: "HTTP Request",
  type: "httpRequest",
  icon: Cloud,
  width: 260,

  fields: [
    {
      name: "url",
      label: "URL",
      type: "text",
      defaultValue: "",
      placeholder: "https://api.example.com",
    },
    {
      name: "method",
      label: "Method",
      type: "select",
      defaultValue: "GET",
      options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      defaultValue: "",
      placeholder: "Optional request body",
    },
  ],

  inputHandles: [{ id: "input", label: "Input" }],
  outputHandles: [{ id: "response", label: "Response" }],
};
