import { useEffect, useState } from "react";
import mermaid from "mermaid";

// Posiciones predeterminadas para las imágenes decorativas
const defaultPositions = [
  { top: "5%", left: "10%" },
  { top: "5%", left: "50%" },
  { top: "5%", left: "90%" },
  { top: "50%", left: "5%" },
  { top: "50%", left: "95%" },
  { top: "95%", left: "10%" },
  { top: "95%", left: "50%" },
  { top: "95%", left: "90%" },
];

const DecorativeImage = ({ src, index, positions = defaultPositions }) => {
  const position = positions[index % positions.length];

  return (
    <img
      src={`https://apipavin.mediaserviceagency.com/storage/${src}`}
      alt="decorative"
      className="decorative-image"
      style={{
        position: "absolute",
        ...position,
        width: "100px",
        height: "auto",
        objectFit: "contain",
        zIndex: 1,
        opacity: 1,
        transition: "all 0.3s ease",
        pointerEvents: "none",
      }}
    />
  );
};

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
        nodeSpacing: 100,
        rankSpacing: 100,
        padding: 20,
        defaultRenderer: "dagre-d3",
        fontSize: "38px",
      },
      themeVariables: {
        fontFamily: "Arial",
        fontSize: "38px",
        nodeBorder: "2px",
        nodeTextColor: "#ffffff",
        nodeRadius: 10,
        lineColor: "#ffffff", // Color por defecto de las líneas
        edgeLabelBackground: "#ffffff", // Color de fondo para etiquetas de conexiones
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
        borderRadius: 10,
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

          nodeMap.forEach((node) => {
            definition += `  ${node.id}["${node.label}"]\n`;
            definition += `  style ${node.id} fill:${node.color},stroke:${node.color},color:${node.colorTexto}\n`;
          });

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
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger">
        Error: {error}
      </div>
    );
  }

  // Definir las posiciones personalizadas para las imágenes
  const customPositions = [
    { top: "0%", left: "0%" },
    { top: "10%", left: "2%" },
    { top: "20%", left: "6%" },
    { top: "10%", left: "10%" },
    { top: "0%", left: "15%" },
    { top: "30%", left: "0%" },
    { top: "27%", left: "10%" },
    { top: "35%", left: "15%" },
    { top: "40%", left: "0%" },
    { top: "40%", left: "25%" },
    { top: "20%", left: "15%" },
    { top: "12%", left: "20%" },
    { top: "30%", left: "20%" },
    { top: "30%", left: "30%" },
    { top: "10%", left: "30%" },
    { top: "20%", left: "30%" },
    { top: "0%", left: "40%" },
    { top: "10%", left: "45%" },
    { top: "0%", left: "50%" },
    { top: "20%", left: "50%" },
    { top: "30%", left: "40%" },
    { top: "30%", left: "55%" },
    { top: "10%", left: "55%" },
    { top: "0%", left: "65%" },
    { top: "10%", left: "75%" },
    { top: "20%", left: "65%" },
    { top: "0%", left: "80%" },
    { top: "20%", left: "80%" },
    { top: "0%", left: "95%" },
    { top: "10%", left: "90%" },
    { top: "20%", left: "95%" },

    { top: "95%", left: "2%" },
    { top: "85%", left: "7%" },
    { top: "75%", left: "2%" },
    { top: "65%", left: "7%" },
    { top: "60%", left: "15%" },
    { top: "90%", left: "15%" },
    { top: "85%", left: "25%" },
    { top: "80%", left: "20%" },
    { top: "70%", left: "25%" },
    { top: "60%", left: "25%" },
    { top: "66%", left: "35%" },
    { top: "78%", left: "30%" },
    { top: "75%", left: "45%" },
    { top: "85%", left: "40%" },
    { top: "95%", left: "45%" },
    { top: "70%", left: "55%" },
    { top: "75%", left: "65%" },
    { top: "95%", left: "55%" },
    { top: "95%", left: "70%" },
    { top: "85%", left: "75%" },
    { top: "75%", left: "80%" },
    { top: "95%", left: "90%" },
    { top: "80%", left: "95%" },
  ];

  // Duplicar imágenes para tener más elementos decorativos
  const decorativeImages = data?.imagenes?.flatMap((img) => [img.imagen]) || [];

  return (
    <div
      className="container-map position-relative overflow-hidden"
      style={{
        backgroundColor: data?.proceso?.color_fondo || "#1d40be",
        minHeight: "100vh",
      }}
    >
      {/* Capa de imágenes decorativas */}
      <div
        className="position-absolute w-100 h-100"
        style={{ pointerEvents: "none" }}
      >
        {decorativeImages.map((imagen, index) => (
          <DecorativeImage
            key={index}
            src={imagen}
            index={index}
            positions={customPositions} // Pasamos las posiciones personalizadas
          />
        ))}
      </div>

      {/* Capa del diagrama */}
      <div
        className="position-relative w-100 h-100 overflow-auto"
        style={{ zIndex: 10 }}
      >
        <div className="mermaid w-100 h-100">{diagramDefinition}</div>
      </div>
    </div>
  );
};

export default OrganigramaHorizontal;
