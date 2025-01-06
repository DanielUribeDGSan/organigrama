import { useState } from "react";
import "./OrganigramaMain.scss";
import { Spinner } from "../components/spinners/Spinner";

export const OrganigramaMain = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="main-section">
      {isLoading && (
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner style={{ height: "3rem", width: "3rem", color: "#000" }} />
        </div>
      )}

      {/* Contenedor para las imágenes */}
      <div className="image-container">
        <img
          className="main-image"
          src="/assets/img/main/main.png"
          onLoad={() => setIsLoading(false)}
        />
        <div className="images">
          <img src="/assets/img/main/PTW_CIRCULOS_1.png" />
          <img src="/assets/img/main/PTW_CIRCULOS_2.png" />
        </div>
      </div>
    </section>
  );
};
