import { useState } from "react";
import { CollapseContext } from "./CollapseContext";

// Provider del contexto
// eslint-disable-next-line react/prop-types
export const CollapseProvider = ({ children }) => {
  const [collapsedNodes, setCollapsedNodes] = useState(new Map());
  // Nuevo estado para rastrear qué nodos están "controlando activamente" otros nodos
  const [controllingNodes, setControllingNodes] = useState(new Map());
  // Estado para rastrear conexiones especiales activas (qué nodo controla a cuál)
  const [specialConnections, setSpecialConnections] = useState(new Map());
  // Estado para rastrear si ya se inicializó
  const [initialized, setInitialized] = useState(false);

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

  // Nueva función para inicializar el estado según expand
  const initializeNodesState = (allNodes, expandAll) => {
    if (initialized || !allNodes || allNodes.length === 0) return;

    console.log(`Initializing nodes state with expandAll: ${expandAll}`);

    const initialCollapsedState = new Map();

    // Función recursiva para procesar nodos y asignar levels
    const processNode = (node, level = 1) => {
      // LÓGICA CORREGIDA: Si expand es 0, colapsar TODOS los nodos incluyendo el root
      // Esto hace que inicialmente solo se vea el nodo raíz sin sus hijos
      const shouldCollapse = !expandAll; // Si expand = 0, colapsar TODO

      if (shouldCollapse) {
        console.log(
          `Initializing node ${node.id} (${
            node.nombre || "null"
          }) at level ${level} as collapsed`
        );
        initialCollapsedState.set(node.id, true);
      } else {
        console.log(
          `Initializing node ${node.id} (${
            node.nombre || "null"
          }) at level ${level} as expanded`
        );
        initialCollapsedState.set(node.id, false);
      }

      // Procesar hijos recursivamente
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          processNode(child, level + 1);
        });
      }
    };

    // Función para obtener todos los nodos planos
    const flattenNodes = (node) => {
      let nodes = [node];
      if (node.children) {
        node.children.forEach((child) => {
          nodes = [...nodes, ...flattenNodes(child)];
        });
      }
      return nodes;
    };

    // Si allNodes es un solo nodo (el root), procesarlo
    if (allNodes.id) {
      processNode(allNodes);
      const flatNodes = flattenNodes(allNodes);

      // Procesar todos los nodos planos para encontrar sus niveles correctos
      flatNodes.forEach((node) => {
        calculateNodeLevel(node, allNodes);
        const shouldCollapse = !expandAll; // Si expand = 0, colapsar TODO
        initialCollapsedState.set(node.id, shouldCollapse);
      });
    }

    setCollapsedNodes(initialCollapsedState);
    setInitialized(true);
  };

  // Función auxiliar para calcular el nivel de un nodo
  const calculateNodeLevel = (targetNode, rootNode, currentLevel = 1) => {
    if (targetNode.id === rootNode.id) {
      return currentLevel;
    }

    if (rootNode.children) {
      for (const child of rootNode.children) {
        if (child.id === targetNode.id) {
          return currentLevel + 1;
        }

        const foundLevel = calculateNodeLevel(
          targetNode,
          child,
          currentLevel + 1
        );
        if (foundLevel > 0) {
          return foundLevel;
        }
      }
    }

    return 0;
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

  // Nueva función para manejar conexiones especiales
  const setSpecialConnection = (sourceId, targetId, isActive) => {
    setSpecialConnections((prev) => {
      const newMap = new Map(prev);
      const key = `${sourceId}->${targetId}`;
      if (isActive) {
        newMap.set(key, { source: sourceId, target: targetId });
      } else {
        newMap.delete(key);
      }
      return newMap;
    });
  };

  // Verificar si un nodo está siendo mostrado por una conexión especial
  const isNodeShownBySpecialConnection = (nodeId) => {
    for (const [connection] of specialConnections) {
      if (connection.target === nodeId) {
        return true;
      }
    }
    return false;
  };

  // FUNCIÓN MEJORADA: Verificar si un nodo está siendo controlado por conexión especial
  const isNodeControlledBySpecialConnection = (nodeId, allNodes) => {
    if (!allNodes) return false;

    const node = allNodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // Si el nodo está siendo mostrado explícitamente por una conexión especial, NO está controlado
    if (isNodeShownBySpecialConnection(nodeId)) {
      return false;
    }

    // Verificar si este nodo tiene parent_second_id o parent_third_id
    // Y ese controlador está activo
    if (node.parent_second_id) {
      const controller = allNodes.find((n) => n.id === node.parent_second_id);
      if (controller && isNodeControlling(controller.id)) {
        // Verificar si hay una conexión activa específica
        const connectionKey = `${controller.id}->${nodeId}`;
        const hasActiveConnection = Array.from(specialConnections.keys()).some(
          (key) => key === connectionKey
        );
        // Si no hay conexión activa, está controlado (oculto)
        return !hasActiveConnection;
      }
    }

    if (node.parent_third_id) {
      const controller = allNodes.find((n) => n.id === node.parent_third_id);
      if (controller && isNodeControlling(controller.id)) {
        // Verificar si hay una conexión activa específica
        const connectionKey = `${controller.id}->${nodeId}`;
        const hasActiveConnection = Array.from(specialConnections.keys()).some(
          (key) => key === connectionKey
        );
        // Si no hay conexión activa, está controlado (oculto)
        return !hasActiveConnection;
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

    // Verificar si hay una conexión especial activa
    const connectionKey = `${sourceNodeId}->${targetNodeId}`;
    const hasActiveConnection = specialConnections.has(connectionKey);

    if (hasActiveConnection) {
      // Si la conexión está activa, desactivarla (colapsar)
      console.log(`Deactivating special connection: ${connectionKey}`);
      setSpecialConnection(sourceNodeId, targetNodeId, false);
      setNodeControlling(sourceNodeId, false);

      // Si el nodo no tiene otros controladores activos, ocultarlo
      if (!isNodeShownBySpecialConnection(targetNodeId)) {
        toggleNodeCollapse(targetNodeId, true);
      }
    } else {
      // Si la conexión no está activa, activarla (expandir)
      console.log(`Activating special connection: ${connectionKey}`);
      setSpecialConnection(sourceNodeId, targetNodeId, true);
      setNodeControlling(sourceNodeId, true);

      // Mostrar el nodo target
      toggleNodeCollapse(targetNodeId, false);

      // IMPORTANTE: También mostrar todos los ancestros del nodo target
      if (allNodes) {
        showAncestors(targetNodeId, allNodes);
      }
    }
  };

  // Nueva función para mostrar todos los ancestros de un nodo
  const showAncestors = (nodeId, allNodes) => {
    const node = allNodes.find((n) => n.id === nodeId);
    if (!node || !node.parent_id) return;

    const parent = allNodes.find((n) => n.id === node.parent_id);
    if (parent) {
      console.log(`Showing ancestor ${parent.id} of node ${nodeId}`);
      toggleNodeCollapse(parent.id, false);
      // Recursivamente mostrar los ancestros del padre
      showAncestors(parent.id, allNodes);
    }
  };

  // NUEVA FUNCIÓN: Limpiar conflictos cuando se hace colapso normal
  const handleNormalCollapse = (nodeId, isCollapsed, allNodes = null) => {
    console.log(`handleNormalCollapse: ${nodeId} -> ${isCollapsed}`);

    // Si estamos colapsando un nodo, verificar si tiene conexiones especiales activas
    if (isCollapsed && allNodes) {
      // Buscar todas las conexiones especiales que originen de este nodo
      const connectionsToRemove = [];
      for (const [key, connection] of specialConnections) {
        if (connection.source === nodeId) {
          connectionsToRemove.push(key);
        }
      }

      // Remover las conexiones especiales
      connectionsToRemove.forEach((key) => {
        const connection = specialConnections.get(key);
        console.log(
          `Removing special connection due to normal collapse: ${key}`
        );
        setSpecialConnection(connection.source, connection.target, false);
      });

      // Desactivar el estado de controlling
      if (connectionsToRemove.length > 0) {
        setNodeControlling(nodeId, false);
      }
    }

    // Si estamos expandiendo un nodo (isCollapsed = false),
    // necesitamos asegurarnos de que sus hijos directos sean visibles
    if (!isCollapsed && allNodes) {
      const node = allNodes.find((n) => n.id === nodeId);
      if (node && node.children) {
        // IMPORTANTE: Al expandir un nodo, sus hijos directos deben ser visibles
        // pero NO necesariamente expandidos (mantienen su estado de colapso)
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
              setSpecialConnection(child.parent_second_id, child.id, false);
            }
            if (child.parent_third_id) {
              setNodeControlling(child.parent_third_id, false);
              setSpecialConnection(child.parent_third_id, child.id, false);
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
    const connectionsInfo = {};

    collapsedNodes.forEach((value, key) => {
      collapsedInfo[key] = value;
    });

    controllingNodes.forEach((value, key) => {
      controllingInfo[key] = value;
    });

    specialConnections.forEach((value, key) => {
      connectionsInfo[key] = value;
    });

    console.log("Current collapsed nodes:", collapsedInfo);
    console.log("Current controlling nodes:", controllingInfo);
    console.log("Current special connections:", connectionsInfo);

    return {
      collapsed: collapsedInfo,
      controlling: controllingInfo,
      connections: connectionsInfo,
    };
  };

  // Función para resetear todos los estados
  const resetAllCollapsed = () => {
    console.log("Resetting all collapsed states");
    setCollapsedNodes(new Map());
    setControllingNodes(new Map());
    setSpecialConnections(new Map());
    setInitialized(false);
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
        isNodeShownBySpecialConnection,
        handleNormalCollapse,
        getDebugInfo,
        resetAllCollapsed,
        initializeNodesState, // Nueva función expuesta
        initialized,
      }}
    >
      {children}
    </CollapseContext.Provider>
  );
};
