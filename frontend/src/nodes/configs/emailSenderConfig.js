import { Mail } from 'lucide-react';

export const emailSenderConfig = {
  title: "Email Sender",
  type: "emailSender",
  icon: Mail,
  width: 270,

  fields: [
    {
      name: "to",
      label: "To",
      type: "text",
      defaultValue: "",
      placeholder: "recipient@example.com",
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      defaultValue: "",
      placeholder: "Email subject",
    },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      defaultValue: "",
      placeholder: "Email content...",
    },
    {
      name: "cc",
      label: "CC (optional)",
      type: "text",
      defaultValue: "",
      placeholder: "cc@example.com",
    },
  ],

  inputHandles: [
    { id: "to", label: "To" },
    { id: "subject", label: "Subject" },
    { id: "body", label: "Body" },
  ],
  outputHandles: [
    { id: "status", label: "Status" },
    { id: "message_id", label: "Message ID" },
  ],
};
