import { useState } from "react";
import { CollapseContext } from "./CollapseContext";

// Provider del contexto
// eslint-disable-next-line react/prop-types
export const CollapseProvider = ({ children }) => {
  const [collapsedNodes, setCollapsedNodes] = useState(new Map());
  // Nuevo estado para rastrear qué nodos están "controlando activamente" otros nodos
  const [controllingNodes, setControllingNodes] = useState(new Map());

  const toggleNodeCollapse = (nodeId, isCollapsed) => {
    console.log(`Setting node ${nodeId} to collapsed: ${isCollapsed}`);
    setCollapsedNodes((prev) => {
      const newMap = new Map(prev);
      newMap.set(nodeId, isCollapsed);
      return newMap;
    });
  };

  const isNodeCollapsed = (nodeId) => {
    // Si el nodo no está en el mapa, NO está colapsado por defecto
    return collapsedNodes.has(nodeId) ? collapsedNodes.get(nodeId) : false;
  };

  // Nueva función para manejar el estado de "controlando"
  const setNodeControlling = (nodeId, isControlling) => {
    console.log(`Setting node ${nodeId} as controlling: ${isControlling}`);
    setControllingNodes((prev) => {
      const newMap = new Map(prev);
      newMap.set(nodeId, isControlling);
      return newMap;
    });
  };

  const isNodeControlling = (nodeId) => {
    return controllingNodes.get(nodeId) || false;
  };

  // FUNCIÓN MEJORADA: Verificar si un nodo está siendo controlado por conexión especial
  const isNodeControlledBySpecialConnection = (nodeId, allNodes) => {
    if (!allNodes) return false;

    const node = allNodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // Verificar si este nodo tiene parent_second_id o parent_third_id
    // Y ese controlador está activo
    if (node.parent_second_id) {
      const controller = allNodes.find((n) => n.id === node.parent_second_id);
      if (controller && isNodeControlling(controller.id)) {
        return true;
      }
    }

    if (node.parent_third_id) {
      const controller = allNodes.find((n) => n.id === node.parent_third_id);
      if (controller && isNodeControlling(controller.id)) {
        return true;
      }
    }

    return false;
  };

  // Función mejorada para colapsar nodos conectados
  const collapseConnectedNode = (
    sourceNodeId,
    targetNodeId,
    allNodes = null
  ) => {
    console.log(
      `collapseConnectedNode called: ${sourceNodeId} -> ${targetNodeId}`
    );

    // Obtener estados actuales
    const currentTargetState = collapsedNodes.get(targetNodeId) || false;
    // const currentControllingState = controllingNodes.get(sourceNodeId) || false;

    // LÓGICA MEJORADA: Si el nodo target está siendo controlado por conexión especial,
    // primero desactivar ese control antes de permitir el colapso normal
    if (
      allNodes &&
      isNodeControlledBySpecialConnection(targetNodeId, allNodes)
    ) {
      console.log(
        `Node ${targetNodeId} is controlled by special connection, clearing controllers first`
      );

      // Buscar y desactivar todos los controladores de este nodo
      const targetNode = allNodes.find((n) => n.id === targetNodeId);
      if (targetNode) {
        if (targetNode.parent_second_id) {
          setNodeControlling(targetNode.parent_second_id, false);
        }
        if (targetNode.parent_third_id) {
          setNodeControlling(targetNode.parent_third_id, false);
        }
      }
    }

    // Para conexiones especiales, hacer toggle del target
    const newTargetState = !currentTargetState;

    console.log(
      `Target ${targetNodeId} current state: ${currentTargetState} -> new state: ${newTargetState}`
    );

    // Actualizar el estado del nodo target
    toggleNodeCollapse(targetNodeId, newTargetState);

    // IMPORTANTE: Para el nodo fuente, usar el estado de "controlando" en lugar de "colapsado"
    // Esto permite que MCR controle a EVENT sin ocultarse a sí mismo
    setNodeControlling(sourceNodeId, newTargetState);

    console.log(
      `Setting source ${sourceNodeId} as controlling: ${newTargetState}`
    );
  };

  // NUEVA FUNCIÓN: Limpiar conflictos cuando se hace colapso normal
  const handleNormalCollapse = (nodeId, isCollapsed, allNodes = null) => {
    console.log(`handleNormalCollapse: ${nodeId} -> ${isCollapsed}`);

    // Si estamos expandiendo un nodo (isCollapsed = false),
    // verificar si tiene hijos que están siendo controlados por conexiones especiales
    if (!isCollapsed && allNodes) {
      const node = allNodes.find((n) => n.id === nodeId);
      if (node && node.children) {
        node.children.forEach((child) => {
          // Si el hijo está siendo controlado por conexión especial,
          // desactivar ese control para permitir la expansión normal
          if (isNodeControlledBySpecialConnection(child.id, allNodes)) {
            console.log(
              `Clearing special connection control for child ${child.id} of ${nodeId}`
            );

            // Buscar y desactivar controladores
            if (child.parent_second_id) {
              setNodeControlling(child.parent_second_id, false);
            }
            if (child.parent_third_id) {
              setNodeControlling(child.parent_third_id, false);
            }
          }
        });
      }
    }

    // Proceder con el colapso normal
    toggleNodeCollapse(nodeId, isCollapsed);
  };

  // Función para obtener debug info
  const getDebugInfo = () => {
    const collapsedInfo = {};
    const controllingInfo = {};

    collapsedNodes.forEach((value, key) => {
      collapsedInfo[key] = value;
    });

    controllingNodes.forEach((value, key) => {
      controllingInfo[key] = value;
    });

    console.log("Current collapsed nodes:", collapsedInfo);
    console.log("Current controlling nodes:", controllingInfo);

    return { collapsed: collapsedInfo, controlling: controllingInfo };
  };

  // Función para resetear todos los estados
  const resetAllCollapsed = () => {
    console.log("Resetting all collapsed states");
    setCollapsedNodes(new Map());
    setControllingNodes(new Map());
  };

  return (
    <CollapseContext.Provider
      value={{
        collapsedNodes,
        toggleNodeCollapse,
        isNodeCollapsed,
        collapseConnectedNode,
        isNodeControlling,
        setNodeControlling,
        isNodeControlledBySpecialConnection,
        handleNormalCollapse,
        getDebugInfo,
        resetAllCollapsed,
      }}
    >
      {children}
    </CollapseContext.Provider>
  );
};
