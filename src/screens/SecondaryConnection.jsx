import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";

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

function Node({ node, parent, allNodes }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Find secondary connection target if exists
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
