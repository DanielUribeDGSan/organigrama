import { ToastContainer } from "react-toastify";
import AppRouter from "./routers/AppRouter";

const OrganigramaApp = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};

export default OrganigramaApp;
