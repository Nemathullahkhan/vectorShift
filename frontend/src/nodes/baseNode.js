import { useState, useEffect, useRef, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";
import {
  extractVariables,
  validateAllVariables,
} from "../utils/variableParser";
import { getNodeConfig } from "./nodeRegistry";
import { useVariableSelector } from "../hooks/useVariableSelector";
import { VariableSelector } from "../components/variableSelector";

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeDynamicHandles = useStore(
    (state) => state.updateNodeDynamicHandles,
  );
  const nodes = useStore((state) => state.nodes);

  const [fieldValues, setFieldValues] = useState(() =>
    config.fields.reduce((acc, field) => {
      acc[field.name] = data[field.name] ?? field.defaultValue ?? "";
      return acc;
    }, {}),
  );

  const [hasInvalidVariables, setHasInvalidVariables] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const previousVariablesRef = useRef([]);
  const updateTimeoutRef = useRef(null);

  const nodeContainerRef = useRef(null);

  const {
    isOpen: selectorOpen,
    position: selectorPosition,
    openSelector,
    closeSelector,
    insertVariable,
    getAvailableNodes,
    getNodeOutputFields,
    checkAndCloseIfTriggerRemoved,
  } = useVariableSelector();

  const handleTextareaResize = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
  }, []);

  const updateFieldValue = useCallback(
    (fieldName, newValue) => {
      setFieldValues((prev) => ({ ...prev, [fieldName]: newValue }));
      updateNodeField(id, fieldName, newValue);
    },
    [id, updateNodeField],
  );

  const handleChange = useCallback(
    (e, fieldName) => {
      const newValue = e.target.value;
      const cursorPos = e.target.selectionStart;

      // Update local and global state
      setFieldValues((prev) => ({ ...prev, [fieldName]: newValue }));
      updateNodeField(id, fieldName, newValue);

      // Check if we need to close the builder because trigger "{{" was removed
      checkAndCloseIfTriggerRemoved(newValue);

      // Check for opening condition
      const textBeforeCursor = newValue.substring(0, cursorPos);
      if (textBeforeCursor.endsWith("{{") && cursorPos >= 2) {
        openSelector(
          fieldName,
          id,
          cursorPos,
          e.target,
          newValue,
          updateFieldValue,
          nodeContainerRef,
        );
      }
    },
    [
      id,
      updateNodeField,
      openSelector,
      updateFieldValue,
      checkAndCloseIfTriggerRemoved,
    ],
  );

  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const textFields = config.fields.filter(
        (f) => f.type === "text" || f.type === "textarea",
      );
      if (textFields.length === 0) return;

      const allText = textFields
        .map((field) => fieldValues[field.name] || "")
        .join(" ");

      const validation = validateAllVariables(allText, nodes, getNodeConfig);
      setHasInvalidVariables(validation.hasErrors);

      if (validation.hasErrors && validation.invalidVariables.length > 0) {
        setErrorMessage(validation.invalidVariables[0].errorMessage);
      } else {
        setErrorMessage("");
      }

      const dynamicHandles = validation.validVariables.map((v) => ({
        id: `dynamic-${v.nodeName}-${v.fieldName}`,
        label: `${v.nodeName}.${v.fieldName}`,
        color: "#6366f1",
        originalNodeName: v.nodeName,
        originalFieldName: v.fieldName,
      }));

      const currentHandles = JSON.stringify(dynamicHandles);
      const previousHandles = JSON.stringify(previousVariablesRef.current);

      if (currentHandles !== previousHandles) {
        previousVariablesRef.current = dynamicHandles;
        updateNodeDynamicHandles(id, dynamicHandles);
      }
    }, 300);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [fieldValues, id, config.fields, nodes, updateNodeDynamicHandles]);

  const allInputHandles = [
    ...(config.inputHandles || []),
    ...(data.dynamicInputHandles || []),
  ];

  const handleTop = (idx, total) => `${((idx + 1) / (total + 1)) * 100}%`;

  const handleNodeNameChange = (e) => {
    updateNodeField(id, "nodeName", e.target.value);
  };

  return (
    <div
      ref={nodeContainerRef}
      style={{
        position: "relative",
        width: config.width ?? 200,
        minHeight: config.height ?? "auto",
        background: config.bgColor ?? "#ffffff",
        border: `2px solid ${hasInvalidVariables ? "#ef4444" : (config.borderColor ?? "#cbd5e1")}`,
        borderRadius: "10px",
        padding: "10px 12px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Editable Node Name */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <input
          type="text"
          value={data.nodeName || config.title}
          onChange={handleNodeNameChange}
          style={{
            fontWeight: 700,
            fontSize: "13px",
            color: config.titleColor ?? "#1e293b",
            textAlign: "center",
            letterSpacing: "0.3px",
            border: "1px solid transparent",
            background: "transparent",
            width: "100%",
            padding: "2px",
            borderRadius: "4px",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#cbd5e1")}
          onBlur={(e) => (e.target.style.borderColor = "transparent")}
        />
        {hasInvalidVariables && errorMessage && (
          <div
            style={{
              fontSize: "10px",
              color: "#ef4444",
              marginTop: "4px",
              background: "#fef2f2",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}
      </div>

      {/* Input Handles (Left side) */}
      {allInputHandles.map((handle, idx) => (
        <Handle
          key={`input-${handle.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-input-${handle.id}`}
          title={handle.label}
          style={{
            top: handleTop(idx, allInputHandles.length),
            background: handle.color ?? "#94a3b8",
            width: 10,
            height: 10,
            border: "2px solid #fff",
            borderRadius: "50%",
            zIndex: 10,
          }}
        />
      ))}

      {/* Fields */}
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
                onChange={(e) => handleChange(e, field.name)}
                onInput={handleTextareaResize}
                placeholder={field.placeholder ?? ""}
                style={{
                  width: "100%",
                  padding: "4px 6px",
                  fontSize: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  color: "#1e293b",
                }}
              />
            )}

            {field.type === "select" && (
              <select
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                style={{
                  width: "100%",
                  padding: "4px 6px",
                  fontSize: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  color: "#1e293b",
                }}
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
                onChange={(e) => handleChange(e, field.name)}
                onInput={handleTextareaResize}
                placeholder={field.placeholder ?? ""}
                style={{
                  width: "100%",
                  padding: "4px 6px",
                  fontSize: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  color: "#1e293b",
                  minHeight: "60px",
                  maxHeight: "400px",
                  resize: "none",
                  overflow: "auto",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Output Handles (Right side) */}
      {config.outputHandles?.map((handle, idx) => (
        <Handle
          key={`output-${handle.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-output-${handle.id}`}
          title={handle.label}
          style={{
            top: handleTop(idx, config.outputHandles.length),
            background: handle.color ?? "#94a3b8",
            width: 10,
            height: 10,
            border: "2px solid #fff",
            borderRadius: "50%",
            zIndex: 10,
          }}
        />
      ))}

      {/* Variable Selector rendered inside node */}
      {selectorOpen && (
        <VariableSelector
          isOpen={selectorOpen}
          position={selectorPosition}
          onSelect={insertVariable}
          onClose={closeSelector}
          availableNodes={getAvailableNodes()}
          getNodeFields={getNodeOutputFields}
        />
      )}
    </div>
  );
};
