import { useEffect, useState } from "react";
import mermaid from "mermaid";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";
import "./OrganigramaMap.scss";
import { customPositions, path } from "./data";
import ScrollContainer from "react-indiana-drag-scroll";

const OrganigramaVertical = () => {
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
        nodeSpacing: 100, // Increased spacing between nodes
        rankSpacing: 100, // Increased spacing between ranks
        padding: 10,
        defaultRenderer: "dagre-d3",
        useMaxWidth: false, // Prevent automatic width adjustment
      },
      themeVariables: {
        fontFamily: "Arial",
        fontSize: "16px",
        nodeBorder: "2px",
        nodeTextColor: "#ffffff",
        nodeRadius: 10,
        lineColor: "#ffffff",
        edgeLabelBackground: "#ffffff",
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

      // Define fixed dimensions for nodes
      const nodeStyle = `width:200px;white-space:normal;`;

      nodeMap.set(currentId, {
        id: currentId,
        label: node.nombre,
        activo: node.activo !== undefined ? node.activo : 1,
        color: node.color || "transparent",
        colorTexto: node.color_texto || "#ffffff",
        borderRadius: 10,
        type: node.tipo_sub_proceso_id,
        url: node.url_archivo,
        image: node.imagen,
        tooltip: node.tooltip,
        style: nodeStyle,
        children: node.children || [], // Include children here
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

          let definition = "graph TD\n"; // Changed to TD for vertical orientation
          nodeMap.forEach((node) => {
            if (node.type === 4) {
              definition += ` ${node.id}["<div style='${node.style}' data-bs-toggle='tooltip' data-bs-placement='top' title='${node.tooltip}'>${node.label}</div>"]\n`;
            } else if (node.type === 2) {
              definition += ` ${node.id}["<div style='${node.style}'><a href='${node.url}' target='_blank'><img src='${path}${node.image}' alt='${node.label}' style='width:100px; height:100px; object-fit:contain; margin:auto;'></a></div>"]\n`;
            } else {
              definition += `  ${node.id}["<div style='${node.style}'>${node.label}</div>"]\n`;
            }
            definition += `  style ${node.id} fill:${node.color},stroke:${node.color},color:${node.colorTexto}\n`;
          });

          connections.forEach((connection) => {
            definition += `  ${connection}\n`;
          });

          setDiagramDefinition(definition);
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

  useEffect(() => {
    if (!diagramDefinition) return;

    const initTooltips = () => {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      return [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrapBundleMin.Tooltip(tooltipTriggerEl)
      );
    };

    const tooltipTimeout = setTimeout(initTooltips, 3000);
    return () => clearTimeout(tooltipTimeout);
  }, [diagramDefinition]);

  const handleNodeClick = (nodeId) => {
    // Implement logic to show/hide children nodes dynamically
    console.log("Clicked node: ", nodeId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: data?.proceso?.color_fondo || "#1d40be",
        minHeight: "100vh",
      }}
    >
      <ScrollContainer className="scroll-container">
        <div className="relative w-full h-full ">
          <div className="mermaid min-w-max p-8">{diagramDefinition}</div>
        </div>
      </ScrollContainer>
    </div>
  );
};

export default OrganigramaVertical;
