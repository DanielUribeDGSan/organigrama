import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";
import "./OrganigramaMap.scss";
import { Card } from "./Card";
import ScrollContainer from "react-indiana-drag-scroll";

// Modal component with Bootstrap classes
const Modal = ({ isOpen, onClose, content }) => {
  useEffect(() => {
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
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
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
              hasChildren={node.children?.length > 0}
              collapsed={collapsed}
            />
          </div>
        }
      >
        {!collapsed &&
          node.children?.map((child) => (
            <Node key={child.id} node={child} parent={node} />
          ))}
      </T>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </>
  );
}

export default function OrganigramaMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (result.res === true && result.subprocesos) {
          setData(result.subprocesos);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (error) {
    return <div className="p-3 text-danger">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-3">No data available</div>;
  }
  console.log("data", data.color_fondo);

  return (
    <div
      className="container-map"
      style={{
        backgroundColor: data.color_fondo || "#1d40be",
        backgroundImage: `url(https://apipavin.mediaserviceagency.com/storage/${data.imagen})`,
        backgroundSize: "cover",
      }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col position-relative" style={{ zIndex: 50 }}>
            <div className="d-flex justify-content-center pt-50 pb-50">
              <Node node={data.subprocesos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
