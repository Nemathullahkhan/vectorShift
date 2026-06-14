import { useState, useEffect, useRef, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { X } from "lucide-react";
import { useStore } from "../store";
import { validateAllVariables } from "../utils/variableParser";
import { getNodeConfig } from "./nodeRegistry";
import { useVariableSelector } from "../hooks/useVariableSelector";
import { VariableSelector } from "../components/variableSelector";
import { cn } from "../lib/utils";

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeDynamicHandles = useStore((state) => state.updateNodeDynamicHandles);
  const onNodesChange = useStore((state) => state.onNodesChange);
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

      setFieldValues((prev) => ({ ...prev, [fieldName]: newValue }));
      updateNodeField(id, fieldName, newValue);
      checkAndCloseIfTriggerRemoved(newValue);

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
    [id, updateNodeField, openSelector, updateFieldValue, checkAndCloseIfTriggerRemoved],
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

  const handleDeleteNode = useCallback(() => {
    onNodesChange([{ type: "remove", id }]);
  }, [id, onNodesChange]);

  return (
    <div
      ref={nodeContainerRef}
      style={{
        position: "relative",
        width: config.width ?? 200,
        minHeight: config.height ?? "auto",
      }}
      className={cn(
        "relative rounded-[1.25rem] border bg-card p-3 shadow-card font-sans text-xs",
        hasInvalidVariables ? "border-red-500" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {config.icon && (
            <config.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          )}
          <input
            type="text"
            value={data.nodeName || config.title}
            onChange={handleNodeNameChange}
            className="flex-1 min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-foreground outline-none transition focus:border-border"
          />
        </div>
        <button
          onClick={handleDeleteNode}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground dark:hover:text-red-400 transition-colors"
          title="Delete node"
        >
          <X size={16} />
        </button>
      </div>

      {hasInvalidVariables && errorMessage && (
        <div className="mb-3 rounded-md bg-red-50 dark:bg-red-950 px-2 py-1 text-xs text-red-700 dark:text-red-200">
          ⚠️ {errorMessage}
        </div>
      )}

      {allInputHandles.map((handle, idx) => (
        <Handle
          key={`input-${handle.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-input-${handle.id}`}
          title={handle.label}
          style={{
            top: handleTop(idx, allInputHandles.length),
            background: handle.color ?? "var(--node-handle)",
            width: 10,
            height: 10,
            border: "2px solid #fff",
            borderRadius: "50%",
            zIndex: 10,
          }}
        />
      ))}

      <div className="flex flex-col gap-3">
        {config.fields?.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                onInput={handleTextareaResize}
                placeholder={field.placeholder ?? ""}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            )}

            {field.type === "select" && (
              <select
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                style={{ minHeight: 60, maxHeight: 400, resize: "none" }}
              />
            )}
          </div>
        ))}
      </div>

      {config.outputHandles?.map((handle, idx) => (
        <Handle
          key={`output-${handle.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-output-${handle.id}`}
          title={handle.label}
          style={{
            top: handleTop(idx, config.outputHandles.length),
            background: handle.color ?? "var(--node-handle)",
            width: 10,
            height: 10,
            border: "2px solid #fff",
            borderRadius: "50%",
            zIndex: 10,
          }}
        />
      ))}

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
