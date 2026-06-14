import { Search } from 'lucide-react';

export const webSearchConfig = {
  title: "Web Search",
  type: "webSearch",
  icon: Search,
  width: 260,

  fields: [
    {
      name: "query",
      label: "Query",
      type: "text",
      defaultValue: "",
      placeholder: "Search term...",
    },
    {
      name: "num_results",
      label: "Number of Results",
      type: "text",
      defaultValue: "5",
      placeholder: "1-20",
    },
    {
      name: "source",
      label: "Search Source",
      type: "select",
      defaultValue: "google",
      options: ["google", "bing", "duckduckgo", "brave"],
    },
  ],

  inputHandles: [{ id: "query", label: "Query" }],
  outputHandles: [
    { id: "results", label: "Results" },
    { id: "snippets", label: "Snippets" },
    { id: "links", label: "Links" },
  ],
};