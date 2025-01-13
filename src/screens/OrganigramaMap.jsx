import { useState, useEffect } from "react";
import { GraphView } from "react-digraph";
import "./OrganizationChart.css";

const NODE_KEY = "id";

const GraphConfig = {
  NodeTypes: {
    default: {
      shapeId: "#node",
      shape: (
        <symbol viewBox="0 0 200 80" id="node">
          <rect
            x="0"
            y="0"
            width="200"
            height="80"
            rx="10"
            ry="10"
            fill="#ffffff"
            stroke="#333333"
            strokeWidth="2"
          />
        </symbol>
      ),
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    default: {
      shapeId: "#edge",
      shape: (
        <symbol viewBox="0 0 50 50" id="edge">
          <circle cx="25" cy="25" r="8" fill="currentColor" />
        </symbol>
      ),
    },
  },
};

const OrganizationChart = () => {
  const [state, setState] = useState({
    graph: {
      nodes: [],
      edges: [],
    },
    selected: null,
  });

  const transformApiData = (apiData) => {
    const nodes = [];
    const edges = [];
    const levelMap = new Map();

    const processNode = (node, level = 0, parentId = null) => {
      const nodeId = String(node.id);

      if (!levelMap.has(level)) {
        levelMap.set(level, []);
      }
      levelMap.get(level).push(nodeId);

      const levelNodes = levelMap.get(level);
      const indexInLevel = levelNodes.length - 1;

      // Creamos un nuevo tipo de nodo para cada nodo con su propio texto
      GraphConfig.NodeTypes[nodeId] = {
        ...GraphConfig.NodeTypes.default,
        typeText: node.nombre, // Aquí asignamos el nombre del nodo
      };

      nodes.push({
        id: nodeId,
        title: "", // Dejamos el título vacío porque usaremos typeText
        x: level * 350,
        y: indexInLevel * 200,
        type: nodeId, // Usamos el ID como tipo para que cada nodo use su configuración
      });

      if (parentId) {
        edges.push({
          source: parentId,
          target: nodeId,
          type: "default",
        });
      }

      if (node.children) {
        node.children.forEach((child) => {
          processNode(child, level + 1, nodeId);
        });
      }
    };

    processNode(apiData.subprocesos.subprocesos);
    return { nodes, edges };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://apipavin.mediaserviceagency.com/api/sub-procesos/1"
        );
        const result = await response.json();

        if (result.res && result.subprocesos) {
          const { nodes, edges } = transformApiData(result);
          setState((prev) => ({
            ...prev,
            graph: { nodes, edges },
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onNodeMouseEnter = (event) => {
    const rect = event.currentTarget.querySelector("rect");
    if (rect) {
      rect.style.fill = "#666666";
      rect.style.stroke = "#666666";
    }
  };

  const onNodeMouseLeave = (event) => {
    const rect = event.currentTarget.querySelector("rect");
    if (rect) {
      rect.style.fill = "#333333";
      rect.style.stroke = "#333333";
    }
  };

  const onEdgeMouseEnter = (event) => {
    event.currentTarget.style.stroke = "#666666";
  };

  const onEdgeMouseLeave = (event) => {
    event.currentTarget.style.stroke = "#333333";
  };

  const onSelect = (selected) => {
    setState((prev) => ({ ...prev, selected }));
  };

  const containerStyle = {
    width: "100%",
    height: "800px",
    border: "1px solid #ccc",
  };

  return (
    <div className="org-chart-container" style={containerStyle}>
      <GraphView
        nodeKey={NODE_KEY}
        nodes={state.graph.nodes}
        edges={state.graph.edges}
        selected={state.selected}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        onSelect={onSelect}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        layoutEngineType="HorizontalTree"
        gridSize={20}
        gridDotSize={1}
        nodeSize={200}
        minZoom={0.5}
        maxZoom={1.5}
      />
    </div>
  );
};

export default OrganizationChart;
