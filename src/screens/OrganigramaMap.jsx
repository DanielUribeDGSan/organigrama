import { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
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
      // Usar setTimeout para asegurar que los elementos están renderizados
      setTimeout(() => {
        const startElement = document.querySelector(
          `[data-node-id="${startNode.id}"]`
        );
        const endElement = document.querySelector(
          `[data-node-id="${endNode.id}"]`
        );
        const container = document.querySelector(".container-map");

        if (startElement && endElement && container) {
          const containerRect = container.getBoundingClientRect();
          const startRect = startElement.getBoundingClientRect();
          const endRect = endElement.getBoundingClientRect();

          // Ajustar las coordenadas relativas al scroll
          const startX =
            startRect.left +
            startRect.width / 2 +
            window.scrollX -
            containerRect.left;
          const startY =
            startRect.top +
            startRect.height / 2 +
            window.scrollY -
            containerRect.top;
          const endX =
            endRect.left +
            endRect.width / 2 +
            window.scrollX -
            containerRect.left;
          const endY =
            endRect.top +
            endRect.height / 2 +
            window.scrollY -
            containerRect.top;

          // Calcular puntos de control para la curva
          const deltaX = Math.abs(endX - startX);
          const controlPointOffset = deltaX * 0.5;

          const path = `M ${startX},${startY} 
                       C ${startX + controlPointOffset},${startY} 
                         ${endX - controlPointOffset},${endY} 
                         ${endX},${endY}`;

          setPath(path);
        }
      }, 100);
    };

    calculatePath();

    // Recalcular en scroll y resize
    window.addEventListener("resize", calculatePath);
    window.addEventListener("scroll", calculatePath);

    return () => {
      window.removeEventListener("resize", calculatePath);
      window.removeEventListener("scroll", calculatePath);
    };
  }, [startNode.id, endNode.id]);

  return (
    <svg
      className="secondary-connection"
      style={{
        position: "fixed", // Cambiar a fixed
        top: 0,
        left: 0,
        width: "100vw", // Usar viewport width
        height: "100vh", // Usar viewport height
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <path
        d={path}
        stroke="#f4b042"
        strokeWidth="3"
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
      src={`https://apipavin.mediaserviceagency.com/storage/${src}`}
      alt="decorative"
      className="decorative-image floating-animation"
      style={{
        position: "absolute",
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

function Node({ node, parent, allNodes }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  console.log("node", node);

  const secondaryTarget = node.parent_second_id
    ? allNodes.find((n) => n.id === node.parent_second_id)
    : null;

  const handleCollapse = (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  const handleModalOpen = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth="2px"
          lineColor="#bbc"
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
          <div className="position-relative" data-node-id={node.id}>
            <Card
              node={node}
              onModalOpen={handleModalOpen}
              onCollapse={handleCollapse}
              hasChildren={node?.children?.length > 0}
              collapsed={collapsed}
            />
            {secondaryTarget && (
              <SecondaryConnection startNode={node} endNode={secondaryTarget} />
            )}
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
    { top: "80%", left: "40%" },

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
          `https://apipavin.mediaserviceagency.com/api/sub-procesos/${slug}`
        );
        if (!subprocesosResponse.ok) {
          throw new Error(`HTTP error! status: ${subprocesosResponse.status}`);
        }
        const subprocesosResult = await subprocesosResponse.json();

        // Fetch enlaces data
        const enlacesResponse = await fetch(
          `https://apipavin.mediaserviceagency.com/api/enlaces/${slug}`
        );
        if (!enlacesResponse.ok) {
          throw new Error(`HTTP error! status: ${enlacesResponse.status}`);
        }
        const enlacesResult = await enlacesResponse.json();

        // Update states based on responses
        if (subprocesosResult.res === true && subprocesosResult.subprocesos) {
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
  console.log("enlacesData", enlacesData);

  return (
    <div
      className="container-map position-relative w-100"
      style={{
        backgroundColor: data.color_fondo || "#1d40be",
        backgroundImage: `url(https://apipavin.mediaserviceagency.com/storage/${data.imagen})`,
        backgroundSize: "cover",
      }}
    >
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
              <Node
                node={data.subprocesos}
                allNodes={flattenNodes(data.subprocesos)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
