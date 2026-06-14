import { Image } from 'lucide-react';

export const imageGeneratorConfig = {
  title: "Image Generator",
  type: "imageGenerator",
  icon: Image,
  width: 260,

  fields: [
    {
      name: "prompt",
      label: "Prompt",
      type: "textarea",
      defaultValue: "",
      placeholder: "Describe the image you want...",
    },
    {
      name: "model",
      label: "Model",
      type: "select",
      defaultValue: "dall-e-3",
      options: ["dall-e-3", "dall-e-2", "sdxl", "stable-diffusion-3"],
    },
    {
      name: "size",
      label: "Size",
      type: "select",
      defaultValue: "1024x1024",
      options: ["1024x1024", "1024x1792", "1792x1024", "512x512"],
    },
    {
      name: "quality",
      label: "Quality",
      type: "select",
      defaultValue: "standard",
      options: ["standard", "hd"],
    },
    {
      name: "num_images",
      label: "Number of Images",
      type: "text",
      defaultValue: "1",
      placeholder: "1-10",
    },
  ],

  inputHandles: [{ id: "prompt", label: "Prompt" }],
  outputHandles: [
    { id: "url", label: "URL" },
    { id: "revised_prompt", label: "Revised Prompt" },
  ],
};
