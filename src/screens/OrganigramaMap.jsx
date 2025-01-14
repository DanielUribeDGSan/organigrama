import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

const OrganigramaHorizontal = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagramDefinition, setDiagramDefinition] = useState("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        nodeSpacing: 80,
        rankSpacing: 70,
        padding: 0,
      },
    });
  }, []);

  const generateNodeId = (prefix, index) => `${prefix}${index}`;

  const processNodes = (data) => {
    const nodeMap = new Map();
    const connections = [];
    let counter = 0;

    const processNode = (node, parentId = null) => {
      counter++;
      const currentId = generateNodeId("node", counter);

      nodeMap.set(currentId, {
        id: currentId,
        label: node.nombre,
        activo: node.activo !== undefined ? node.activo : 1,
      });

      if (parentId) {
        connections.push(`${parentId} --> ${currentId}`);
      }

      // Procesar subprocesos si existen
      if (node.subprocesos) {
        processNode(node.subprocesos, currentId);
      }

      // Procesar children si existen
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => {
          processNode(child, currentId);
        });
      }
    };

    // Comenzar el procesamiento con el nodo raíz
    processNode(data.subprocesos);

    return { nodeMap, connections };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://apipavin.mediaserviceagency.com/api/sub-procesos/1"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Datos de la API:", result); // Para depuración

        if (result.res === true && result.subprocesos) {
          const { nodeMap, connections } = processNodes(result);

          let definition = "graph LR\n";

          // Configurar estilos globales
          definition += "  %% Configuración de estilos\n";
          definition +=
            "  classDef active fill:#f94632,stroke:#f84531,color:#ffc7c3\n";
          definition +=
            "  classDef inactive fill:#fdb4ae,stroke:#f84531,color:#f84531\n";
          definition +=
            "  classDef default fill:#f94632,stroke:#f84531,color:#ffc7c3\n";

          // Agregar nodos
          nodeMap.forEach((node) => {
            definition += `  ${node.id}["${node.label}"]\n`;
            if (node.activo === 0) {
              definition += `  class ${node.id} inactive\n`;
            } else {
              definition += `  class ${node.id} active\n`;
            }
          });

          // Agregar conexiones
          connections.forEach((connection) => {
            definition += `  ${connection}\n`;
          });

          console.log("Definición del diagrama:", definition); // Para depuración
          setDiagramDefinition(definition);
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (error) {
        console.error("Error en fetch:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (diagramDefinition) {
      mermaid.contentLoaded();
    }
  }, [diagramDefinition]);

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Organigrama de Procesos
        </h2>
        <div className="mermaid text-center overflow-x-auto">
          {diagramDefinition}
        </div>
      </div>
    </div>
  );
};

export default OrganigramaHorizontal;
