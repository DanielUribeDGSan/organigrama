/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import ScrollContainer from "react-indiana-drag-scroll";
import { ArcherContainer, ArcherElement } from "react-archer";
import _ from "lodash";
import "./OrganigramaMap.scss";
import { Card } from "./Card";
import { useParams } from "react-router-dom";
import { CustomModal } from "../components/modal/CustomModal";
import { CustomizedMenus } from "../components/menu/MenuTop";

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

let dataOrganigrama = {};

const flattenNodes = (node) => {
  let nodes = [node];
  if (node.children) {
    node.children.forEach((child) => {
      nodes = [...nodes, ...flattenNodes(child)];
    });
  }
  return nodes;
};

const SecondaryConnection = ({ startNode, endNode }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    const calculatePath = () => {
      const startElement = document.querySelector(
        `[data-node-id="${startNode.id}"]`
      );
      const endElement = document.querySelector(
        `[data-node-id="${endNode.id}"]`
      );

      if (startElement && endElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();
        const containerRect = document
          .querySelector(".container-map")
          .getBoundingClientRect();

        // Calculate positions relative to container
        const startX =
          startRect.left + startRect.width / 2 - containerRect.left;
        const startY = startRect.top + startRect.height / 2 - containerRect.top;
        const endX = endRect.left + endRect.width / 2 - containerRect.left;
        const endY = endRect.top + endRect.height / 2 - containerRect.top;

        // Create curved path
        const path = `M ${startX} ${startY} 
                     C ${startX} ${(startY + endY) / 2},
                       ${endX} ${(startY + endY) / 2},
                       ${endX} ${endY}`;

        setPath(path);
      }
    };

    // Initial calculation
    calculatePath();

    // Recalculate on window resize
    window.addEventListener("resize", calculatePath);
    return () => window.removeEventListener("resize", calculatePath);
  }, [startNode.id, endNode.id]);

  return (
    <svg
      className="secondary-connection"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <path
        d={path}
        stroke="#f4b042"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
      />
    </svg>
  );
};

const DecorativeImage = ({ src, index, positions = defaultPositions }) => {
  const position = positions[index % positions.length];

  return (
    <img
      src={`https://apipavin.capitaldevs.com/storage/${src}`}
      alt="decorative"
      className="decorative-image floating-animation"
      style={{
        position: "fixed",
        ...position,
        width: "120px",
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

// Card component for nodes

function Node({ node, parent, allNodes, level }) {
  // Inicializar el estado de colapso basado en el nivel y la configuración expandAll
  // Si expandAll es true, ningún nodo estará colapsado inicialmente
  // Si expandAll es false, solo el nodo raíz (nivel 0) comenzará expandido

  const expandAll = dataOrganigrama?.expand === 1 ? true : false;

  const [collapsed, setCollapsed] = useState(expandAll ? false : level > 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const nodeColor = node?.color || "#bbc";

  // Encontrar ambos targets secundarios y terciarios
  const secondaryTarget = node.parent_second_id
    ? allNodes.find((n) => n.id === node.parent_second_id)
    : null;

  const thirdTarget = node.parent_third_id
    ? allNodes.find((n) => n.id === node.parent_third_id)
    : null;

  const handleCollapse = (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  const handleModalOpen = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Crear el array de relaciones combinando ambas conexiones
  const getRelations = () => {
    const relations = [];

    if (secondaryTarget) {
      relations.push({
        targetId: `node-${secondaryTarget.id}`,
        targetAnchor: "left",
        sourceAnchor: "right",
        style: {
          stroke: nodeColor,
          strokeWidth: 2,
          endMarker: false,
          startMarker: true,
        },
        label: null,
        className: "custom-arrow",
        offset: 0,
      });
    }

    if (thirdTarget) {
      relations.push({
        targetId: `node-${thirdTarget.id}`,
        targetAnchor: "left",
        sourceAnchor: "right",
        style: {
          stroke: nodeColor,
          strokeWidth: 2,
          endMarker: false,
          startMarker: true,
        },
        label: null,
        className: "custom-arrow",
        offset: 0,
      });
    }

    return relations;
  };

  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth="2px"
          lineColor={nodeColor}
          lineBorderRadius="12px"
          className="w-100 p-4"
        >
          {props.children}
        </Tree>
      );

  return (
    <>
      <T
        label={
          <div style={{ position: "relative" }}>
            <ArcherElement id={`node-${node.id}`} relations={getRelations()}>
              <div
                className="position-relative"
                data-node-id={node.id}
                style={{
                  display: "inline-block",
                  minWidth: "150px",
                }}
              >
                <Card
                  node={node}
                  onModalOpen={handleModalOpen}
                  onCollapse={handleCollapse}
                  hasChildren={node?.children?.length > 0}
                  collapsed={collapsed}
                />
              </div>
            </ArcherElement>
          </div>
        }
      >
        {!collapsed &&
          node?.children?.map((child) => (
            <Node
              key={child.id}
              node={child}
              parent={node}
              allNodes={allNodes}
              level={level + 1} // Incrementar el nivel para los hijos
            />
          ))}
      </T>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </>
  );
}

export default function OrganigramaMap() {
  const [data, setData] = useState([]);
  const [enlacesData, setEnlacesData] = useState([]);

  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const customPositions = [
    { top: "2%", left: "2%" },
    { top: "2%", left: "30%" },
    { top: "15%", left: "10%" },
    { top: "20%", left: "20%" },
    { top: "35%", left: "1%" },
    { top: "45%", left: "10%" },
    { top: "55%", left: "2%" },
    { top: "65%", left: "15%" },
    { top: "75%", left: "1%" },
    { top: "71%%", left: "40%" },

    { top: "2%", left: "62%" },
    { top: "5%", left: "92%" },
    { top: "20%", left: "85%" },
    { top: "25%", left: "60%" },
    { top: "40%", left: "90%" },
    { top: "45%", left: "75%" },
    { top: "60%", left: "82%" },
    { top: "70%", left: "90%" },
    { top: "70%", left: "70%" },
  ];

  const decorativeImages = imagesData?.flatMap((img) => [img.imagen]) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subprocesos data
        const subprocesosResponse = await fetch(
          `https://apipavin.capitaldevs.com/api/sub-procesos/${slug}`
        );
        if (!subprocesosResponse.ok) {
          throw new Error(`HTTP error! status: ${subprocesosResponse.status}`);
        }
        const subprocesosResult = await subprocesosResponse.json();

        // Fetch enlaces data
        const enlacesResponse = await fetch(
          `https://apipavin.capitaldevs.com/api/enlaces/${slug}`
        );
        if (!enlacesResponse.ok) {
          throw new Error(`HTTP error! status: ${enlacesResponse.status}`);
        }
        const enlacesResult = await enlacesResponse.json();

        // Update states based on responses
        if (subprocesosResult.res === true && subprocesosResult.subprocesos) {
          dataOrganigrama = subprocesosResult.subprocesos;
          setData(subprocesosResult.subprocesos);
          setImagesData(subprocesosResult.imagenes);
        }

        if (enlacesResult.res === true) {
          setEnlacesData(enlacesResult?.enlaces);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);
  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (error) {
    return <div className="p-3 text-danger">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-3">No data available</div>;
  }

  const rootColor = data.subprocesos?.color || "#bbc";

  return (
    <div
      className={`container-map position-relative w-100 ${
        dataOrganigrama?.expand === 1 ? "hidden-ul" : "hidden-ul"
      }`}
      style={{
        backgroundColor: data.color_fondo || "#1d40be",
        backgroundImage: `url(https://apipavin.capitaldevs.com/storage/${data.imagen})`,
        backgroundSize: "cover",
      }}
    >
      <ScrollContainer className="scroll-container" hideScrollbars={false}>
        <CustomizedMenus options={enlacesData} />
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

        <div className="container-fluid">
          <div className="row">
            <div className="col position-relative" style={{ zIndex: 50 }}>
              <div className="d-block pt-50 pb-50">
                <ArcherContainer
                  strokeColor={rootColor}
                  noCurves={false}
                  offset={0}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  svgContainerStyle={{
                    overflow: "visible",
                    position: "absolute",
                  }}
                >
                  <Node
                    node={data.subprocesos}
                    allNodes={flattenNodes(data.subprocesos)}
                    level={1}
                  />
                </ArcherContainer>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </div>
  );
}
