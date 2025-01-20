import React from "react";
import ReactDOM from "react-dom/client";
import OrganigramaApp from "./OrganigramaApp.jsx";

// import './styles/utils.scss';
import "./styles/index.scss";
import "animate.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OrganigramaApp />
  </React.StrictMode>
);
