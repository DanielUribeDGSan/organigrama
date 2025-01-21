import { useState } from "react";
import "./OrganigramaMain.scss";
import { Spinner } from "../components/spinners/Spinner";
import { Link } from "react-router-dom";

export const OrganigramaMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoverCircle1, setHoverCircle1] = useState(false);
  const [hoverCircle2, setHoverCircle2] = useState(false);
  const [hoverCircle3, setHoverCircle3] = useState(false);
  const [hoverCircle4, setHoverCircle4] = useState(false);
  const [hoverCircle5, setHoverCircle5] = useState(false);
  const [hoverCircle6, setHoverCircle6] = useState(false);
  const [hoverCircle7, setHoverCircle7] = useState(false);
  const [hoverCircle8, setHoverCircle8] = useState(false);
  const [hoverCircle9, setHoverCircle9] = useState(false);
  const [hoverCircle10, setHoverCircle10] = useState(false);
  const [hoverCircle11, setHoverCircle11] = useState(false);

  return (
    <section className={isLoading ? "" : "main-section"}>
      {isLoading && (
        <div
          className="d-flex align-items-center justify-content-center h-100 z-3 position-absolute"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Spinner style={{ height: "4rem", width: "4rem", color: "#000" }} />
        </div>
      )}

      <div className="image-container">
        <img
          className="main-image"
          src="/assets/img/main/main.png"
          onLoad={() => setIsLoading(false)}
        />
        <div className="images">
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle1(true)}
              onMouseLeave={() => setHoverCircle1(false)}
            />
          </Link>
          <Link to="/organigrama/local-disposition">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle2(true)}
              onMouseLeave={() => setHoverCircle2(false)}
            />
          </Link>
          <Link to="/organigrama/labelling">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle3(true)}
              onMouseLeave={() => setHoverCircle3(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle4(true)}
              onMouseLeave={() => setHoverCircle4(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle5(true)}
              onMouseLeave={() => setHoverCircle5(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle6(true)}
              onMouseLeave={() => setHoverCircle6(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle7(true)}
              onMouseLeave={() => setHoverCircle7(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle8(true)}
              onMouseLeave={() => setHoverCircle8(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle9(true)}
              onMouseLeave={() => setHoverCircle9(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle10(true)}
              onMouseLeave={() => setHoverCircle10(false)}
            />
          </Link>
          <Link to="/organigrama">
            <div
              className="hover-area"
              onMouseEnter={() => setHoverCircle11(true)}
              onMouseLeave={() => setHoverCircle11(false)}
            />
          </Link>
          {!isLoading && (
            <>
              <img
                src="/assets/img/main/PTW_CIRCULOS_1.png"
                className={`circle-1 ${hoverCircle1 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_2.png"
                className={`circle-2 ${hoverCircle2 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_3.png"
                className={`circle-3 ${hoverCircle3 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_4.png"
                className={`circle-4 ${hoverCircle4 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_5.png"
                className={`circle-5 ${hoverCircle5 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_6.png"
                className={`circle-6 ${hoverCircle6 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_7.png"
                className={`circle-7 ${hoverCircle7 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_8.png"
                className={`circle-8 ${hoverCircle8 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_9.png"
                className={`circle-9 ${hoverCircle9 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_10.png"
                className={`circle-10 ${hoverCircle10 ? "visible" : ""}`}
              />
              <img
                src="/assets/img/main/PTW_CIRCULOS_11.png"
                className={`circle-11 ${hoverCircle11 ? "visible" : ""}`}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
