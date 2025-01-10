import PropTypes from "prop-types";

export const Spinner = ({ style = {}, className = "" }) => {
  return (
    <div
      className={`spinner-border ${className}`}
      role="status"
      id="spinner"
      style={style}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
};
