import { useState } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [fieldValues, setFieldValues] = useState(() =>
    config.fields.reduce((acc, field) => {
      acc[field.name] = data[field.name] ?? field.defaultValue ?? "";
      return acc;
    }, {}),
  );

  const handleChange = (fieldName, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
    updateNodeField(id, fieldName, value);
  };

  // Distribute handles evenly along the edge
  const handleTop = (idx, total) => `${((idx + 1) / (total + 1)) * 100}%`;

  return (
    <div
      style={{
        width: config.width ?? 200,
        minHeight: config.height ?? "auto",
        background: config.bgColor ?? "#ffffff",
        border: `2px solid ${config.borderColor ?? "#cbd5e1"}`,
        borderRadius: "10px",
        padding: "10px 12px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "13px",
          color: config.titleColor ?? "#1e293b",
          marginBottom: "10px",
          textAlign: "center",
          letterSpacing: "0.3px",
        }}
      >
        {config.title}
      </div>

      {config.inputHandles?.map((handle, idx) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          title={handle.label}
          style={{
            top: handleTop(idx, config.inputHandles.length),
            background: handle.color ?? "#94a3b8",
            width: 10,
            height: 10,
            border: "2px solid #fff",
            borderRadius: "50%",
          }}
        />
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {config.fields?.map((field) => (
          <div key={field.name}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "3px",
              }}
            >
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder ?? ""}
                style={inputStyle}
              />
            )}

            {field.type === "select" && (
              <select
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                style={inputStyle}
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "textarea" && (
              <textarea
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder ?? ""}
                style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {config.fields?.map((field) => (
            <div key={field.name}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "3px",
                }}
              >
                {field.label}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  value={fieldValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder ?? ""}
                  style={inputStyle}
                />
              )}

              {field.type === "select" && (
                <select
                  value={fieldValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={inputStyle}
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "textarea" && (
                <textarea
                  value={fieldValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder ?? ""}
                  style={{
                    ...inputStyle,
                    minHeight: "60px",
                    resize: "vertical",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Output Handles (right) ── */}
        {config.outputHandles?.map((handle, idx) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            title={handle.label}
            style={{
              top: handleTop(idx, config.outputHandles.length),
              background: handle.color ?? "#94a3b8",
              width: 10,
              height: 10,
              border: "2px solid #fff",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Shared input style reused across field types
const inputStyle = {
  width: "100%",
  padding: "4px 6px",
  fontSize: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "5px",
  outline: "none",
  boxSizing: "border-box",
  background: "#f8fafc",
  color: "#1e293b",
};
