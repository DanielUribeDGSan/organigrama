import React from "react";
import ReactDOM from "react-dom/client";

// import './styles/utils.scss';
import "./styles/index.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import OrganigramaApp from "./OrganigramaApp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OrganigramaApp />
  </React.StrictMode>
);
