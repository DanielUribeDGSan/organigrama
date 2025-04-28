import { useEffect } from "react";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";
import { replace } from "lodash";

// Card component for nodes
export const Card = ({
  node,
  onModalOpen,
  onCollapse,
  hasChildren,
  collapsed,
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
                style={{ width: "130px", height: "130px", objectFit: "contain" }}
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

  const style = {
    backgroundColor: node?.color || "transparent",
    color: node?.color_texto || "#000000",
    border: node?.tipo_sub_proceso_id === 4 ? "2px solid" : "none",
    borderRadius: "8px",
    marginBottom: "5px",
    cursor: hasChildren ? "pointer" : "default",
    display: "inline-block",
    position: "relative",
    zIndex: 50,
    minWidth: "200px",
    maxWidth: "320px",
    transition: "all 0.2s ease",
  };

  if (hasChildren) {
    style.hover = {
      opacity: 0.9,
    };
  }

  return (
    <div
      className="node-card"
      style={style}
      onClick={hasChildren ? onCollapse : undefined}
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
    </div>
  );
};

// Rest of the components remain the same...
