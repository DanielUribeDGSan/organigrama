import { useContext } from "react";
import { CollapseContext } from "../context/CollapseContext";

export const useCollapse = () => {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error("useCollapse must be used within a CollapseProvider");
  }
  return context;
};
