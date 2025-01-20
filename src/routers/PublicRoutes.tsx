import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { OrganigramaMain } from "../screens/OrganigramaMain";
import OrganigramaVertical from "../screens/OrganigramaMap";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} />*/}
      <Route path="/" element={<OrganigramaMain />} />
      <Route path="/organigrama" element={<OrganigramaVertical />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PublicRoutes;
