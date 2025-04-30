import { ToastContainer } from "react-toastify";
import AppRouter from "./routers/AppRouter";

const App = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};

export default App;
