import React, { useEffect, useState } from "react";
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

function Node({ node, parent }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState("");

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
          <div className="position-relative">
            <Card
              node={node}
              onModalOpen={handleModalOpen}
              onCollapse={handleCollapse}
              hasChildren={node?.children?.length > 0}
              collapsed={collapsed}
            />
          </div>
        }
      >
        {!collapsed &&
          node?.children?.map((child) => (
            <Node key={child.id} node={child} parent={node} />
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
              <Node node={data.subprocesos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
