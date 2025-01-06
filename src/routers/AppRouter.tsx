import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRouter = () => {
  return (
    // <Router>{userData.token ? <PrivateRoutes /> : <PublicRoutes />}</Router>
    <Router>
      {/* <PrivateRoutes /> */}
      <PublicRoutes />
    </Router>
  );
};

export default AppRouter;
