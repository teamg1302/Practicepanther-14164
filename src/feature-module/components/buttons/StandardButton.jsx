import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const StandardButton = ({
  label = "",
  icon,
  onClick,
  className,
  type,
  disabled,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className={`${label ? "me-2" : ""}`}>{icon}</span>}
      {label && t(label)}
    </button>
  );
};
StandardButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  rest: PropTypes.object,
};
StandardButton.defaultProps = {
  className: "",
  icon: null,
  type: "button",
  disabled: false,
  rest: {},
};

export default StandardButton;
