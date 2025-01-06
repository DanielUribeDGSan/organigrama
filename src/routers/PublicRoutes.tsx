import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import OrganigramaMap from "../screens/OrganigramaMap";
import { OrganigramaMain } from "../screens/OrganigramaMain";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} />*/}
      <Route path="/" element={<OrganigramaMain />} />
      <Route path="/organigrama" element={<OrganigramaMap />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PublicRoutes;
