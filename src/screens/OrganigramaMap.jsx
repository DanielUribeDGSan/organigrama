import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

const OrganigramaHorizontal = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagramDefinition, setDiagramDefinition] = useState("");
  const [data, setData] = useState(null);

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
        color: node.color || "#f94632",
        colorTexto: node.color_texto || "#ffffff",
      });

      if (parentId) {
        connections.push(`${parentId} --> ${currentId}`);
      }

      if (node.subprocesos) {
        processNode(node.subprocesos, currentId);
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => {
          processNode(child, currentId);
        });
      }
    };

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
        setData(result);

        if (result.res === true && result.subprocesos) {
          const { nodeMap, connections } = processNodes(result);

          let definition = "graph LR\n";

          // Agregar nodos con sus colores personalizados
          nodeMap.forEach((node) => {
            definition += `  ${node.id}["${node.label}"]\n`;
            definition += `  style ${node.id} fill:${node.color},stroke:${node.color},color:${node.colorTexto}\n`;
          });

          // Agregar conexiones con el color del fondo

          connections.forEach((connection) => {
            definition += `  ${connection}\n`;
          });

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
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen flex flex-col"
      style={{
        backgroundColor: data?.proceso?.color_fondo || "#1d40be",
        minHeight: "100vh",
      }}
    >
      <div className="flex-1 overflow-auto">
        <div className="mermaid w-full h-full">{diagramDefinition}</div>
      </div>
    </div>
  );
};

export default OrganigramaHorizontal;
