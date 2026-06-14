import { useState, useCallback, useRef } from "react";
import { useStore } from "../store";
import { getNodeConfig } from "../nodes/nodeRegistry";

export const useVariableSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [activeField, setActiveField] = useState(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [currentValue, setCurrentValue] = useState("");

  const nodes = useStore((state) => state.nodes);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const currentNodeIdRef = useRef(null);
  const currentTextareaRef = useRef(null);
  const updateFieldCallbackRef = useRef(null);
  const triggerPositionRef = useRef(null); // Store index where {{ starts

  const getAvailableNodes = useCallback(() => {
    return nodes
      .filter((node) => {
        const config = getNodeConfig(node.type);
        return config?.outputHandles && config.outputHandles.length > 0;
      })
      .map((node) => ({
        id: node.id,
        name: node.data?.nodeName || node.type,
        type: node.type,
      }));
  }, [nodes]);

  const getNodeOutputFields = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return [];

      const config = getNodeConfig(node.type);
      return config?.outputHandles || [];
    },
    [nodes],
  );

  // Check if the trigger "{{" still exists at the stored position
  const isTriggerStillPresent = useCallback((text) => {
    if (triggerPositionRef.current === null) return false;
    const pos = triggerPositionRef.current;
    return text.substring(pos, pos + 2) === "{{";
  }, []);

  const openSelector = useCallback(
    (
      fieldName,
      nodeId,
      cursorPosition,
      textareaElement,
      currentFieldValue,
      updateFieldCallback,
      nodeContainerRef,
    ) => {
      requestAnimationFrame(() => {
        if (!textareaElement || !nodeContainerRef?.current) return;

        const textareaRect = textareaElement.getBoundingClientRect();
        const nodeRect = nodeContainerRef.current.getBoundingClientRect();

        const relativeLeft = textareaRect.left - nodeRect.left;
        const relativeTop = textareaRect.bottom - nodeRect.top + 5;
        const width = textareaRect.width;

        setPosition({
          top: relativeTop,
          left: relativeLeft,
          width: width,
        });

        setActiveField(fieldName);
        setCursorPos(cursorPosition);
        setCurrentValue(currentFieldValue);
        currentNodeIdRef.current = nodeId;
        currentTextareaRef.current = textareaElement;
        updateFieldCallbackRef.current = updateFieldCallback;

        // Store the position where "{{" starts (cursorPosition is after the second '{', so start = cursorPosition - 2)
        triggerPositionRef.current = cursorPosition - 2;

        setIsOpen(true);
      });
    },
    [],
  );

  const closeSelector = useCallback(() => {
    setIsOpen(false);
    setActiveField(null);
    setCurrentValue("");
    currentNodeIdRef.current = null;
    currentTextareaRef.current = null;
    updateFieldCallbackRef.current = null;
    triggerPositionRef.current = null;
  }, []);

  const insertVariable = useCallback(
    (variableString) => {
      if (!activeField || !currentNodeIdRef.current) return;

      const newValue =
        currentValue.substring(0, cursorPos) +
        variableString +
        currentValue.substring(cursorPos);

      if (updateFieldCallbackRef.current) {
        updateFieldCallbackRef.current(activeField, newValue);
      }

      updateNodeField(currentNodeIdRef.current, activeField, newValue);

      if (currentTextareaRef.current) {
        currentTextareaRef.current.focus();
        const newCursorPos = cursorPos + variableString.length;
        currentTextareaRef.current.setSelectionRange(
          newCursorPos,
          newCursorPos,
        );
      }

      closeSelector();
    },
    [activeField, cursorPos, currentValue, updateNodeField, closeSelector],
  );

  // Expose a method to check and close if trigger removed
  const checkAndCloseIfTriggerRemoved = useCallback(
    (newValue) => {
      if (isOpen && !isTriggerStillPresent(newValue)) {
        closeSelector();
      }
    },
    [isOpen, isTriggerStillPresent, closeSelector],
  );

  return {
    isOpen,
    position,
    openSelector,
    closeSelector,
    insertVariable,
    getAvailableNodes,
    getNodeOutputFields,
    checkAndCloseIfTriggerRemoved,
  };
};
