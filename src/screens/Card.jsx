/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";

// Card component for nodes
export const Card = ({
  node,
  onModalOpen,
  onCollapse,
  hasChildren,
  collapsed,
  hasConnections = false, // Nueva prop para indicar si tiene conexiones
}) => {
  useEffect(() => {
    // Initialize Bootstrap tooltips
    if (node?.tipo_sub_proceso_id === 4 && node?.tooltip) {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrapBundleMin.Tooltip(tooltipTriggerEl)
      );
    }
  }, []);

  const getNodeContent = () => {
    switch (node?.tipo_sub_proceso_id) {
      case 2:
        // Image with PDF link
        if (node?.imagen) {
          return (
            <a
              href={node?.url_archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block"
              onClick={(e) => e.stopPropagation()}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={node?.tooltip ?? node?.url_archivo}
            >
              <img
                src={`https://apipavin.capitaldevs.com/storage/${node?.imagen}`}
                alt={node?.imagen || "Node image"}
                className="img-fluid mx-auto d-block"
                style={{
                  width: `${node?.width}px`,
                  height: `${node?.height}px`,
                  objectFit: "contain",
                }}
              />
            </a>
          );
        }
        break;

      case 3:
        // Node with modal
        return (
          <div className="p-3 text-center">
            <div
              dangerouslySetInnerHTML={{ __html: node?.nombre }}
              style={{ fontSize: node?.texto }}
            />
            {node?.modal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onModalOpen(node?.modal);
                }}
                className="btn btn-link btn-sm ms-2 p-0"
              >
                ℹ️
              </button>
            )}
          </div>
        );

      case 4:
        // Node with Bootstrap tooltip
        return (
          <div
            className="p-3 text-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={node?.tooltip || ""}
          >
            <div
              dangerouslySetInnerHTML={{ __html: node?.nombre }}
              style={{ fontSize: node?.texto }}
            />
          </div>
        );

      default:
        // Regular node
        return (
          <div
            className="p-3 text-center"
            dangerouslySetInnerHTML={{ __html: node?.nombre }}
            style={{ fontSize: node?.texto }}
          />
        );
    }
  };

  // Determinar si el nodo debe ser clickeable
  const isClickable = hasChildren || hasConnections;

  const style = {
    backgroundColor: node?.color || "transparent",
    color: node?.color_texto || "#000000",
    border: node?.tipo_sub_proceso_id === 4 ? "2px solid" : "none",
    borderRadius: "8px",
    marginBottom: "5px",
    cursor: isClickable ? "pointer" : "default", // Cambiar cursor si es clickeable
    display: "inline-block",
    position: "relative",
    zIndex: 50,
    minWidth: "200px",
    maxWidth: "320px",
    transition: "all 0.2s ease",
  };

  if (isClickable) {
    style.hover = {
      opacity: 0.9,
    };
  }

  return (
    <div
      className="node-card"
      style={style}
      onClick={isClickable ? onCollapse : undefined} // Hacer clickeable si tiene hijos o conexiones
    >
      {getNodeContent()}
      {hasChildren && (
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{
            bottom: "-24px",
            transform: `translateX(-50%) ${collapsed ? "" : "rotate(180deg)"}`,
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </div>
      )}
      {/* Indicador visual para nodos con conexiones pero sin hijos */}
      {!hasChildren && hasConnections && (
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{
            bottom: "-24px",
            transform: "translateX(-50%)",
            fontSize: "14px",
            color: node?.color,
            fontWeight: "bold",
          }}
        >
          ▼
        </div>
      )}
    </div>
  );
};
