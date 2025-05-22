import { useState } from "react";
import { CollapseContext } from "./CollapseContext";

// Provider del contexto
// eslint-disable-next-line react/prop-types
export const CollapseProvider = ({ children }) => {
  const [collapsedNodes, setCollapsedNodes] = useState(new Map());

  const toggleNodeCollapse = (nodeId, isCollapsed) => {
    console.log(`Setting node ${nodeId} to collapsed: ${isCollapsed}`);
    setCollapsedNodes((prev) => {
      const newMap = new Map(prev);
      newMap.set(nodeId, isCollapsed);
      return newMap;
    });
  };

  const isNodeCollapsed = (nodeId) => {
    return collapsedNodes.get(nodeId) || false;
  };

  // Función mejorada para colapsar nodos conectados
  const collapseConnectedNode = (sourceNodeId, targetNodeId) => {
    console.log(
      `collapseConnectedNode called: ${sourceNodeId} -> ${targetNodeId}`
    );

    // Verificar el estado actual del nodo fuente
    const sourceIsCollapsed = collapsedNodes.get(sourceNodeId) || false;

    // Si el nodo fuente NO tiene hijos (como MCR), entonces al hacer click
    // queremos hacer toggle del estado del target
    const currentTargetState = collapsedNodes.get(targetNodeId) || false;
    const newTargetState = !currentTargetState;

    console.log(`Source ${sourceNodeId} collapsed: ${sourceIsCollapsed}`);
    console.log(
      `Target ${targetNodeId} current state: ${currentTargetState} -> new state: ${newTargetState}`
    );

    toggleNodeCollapse(targetNodeId, newTargetState);

    // También actualizar el estado del nodo fuente si no tiene hijos
    // Esto ayuda a mantener el estado sincronizado
    if (!sourceIsCollapsed) {
      toggleNodeCollapse(sourceNodeId, true);
    }
  };

  // Función para obtener debug info
  const getDebugInfo = () => {
    const info = {};
    collapsedNodes.forEach((value, key) => {
      info[key] = value;
    });
    console.log("Current collapsed nodes:", info);
    return info;
  };

  // Función para resetear todos los estados
  const resetAllCollapsed = () => {
    console.log("Resetting all collapsed states");
    setCollapsedNodes(new Map());
  };

  return (
    <CollapseContext.Provider
      value={{
        collapsedNodes,
        toggleNodeCollapse,
        isNodeCollapsed,
        collapseConnectedNode,
        getDebugInfo,
        resetAllCollapsed,
      }}
    >
      {children}
    </CollapseContext.Provider>
  );
};
