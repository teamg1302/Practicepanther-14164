import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormButton = ({ type, isSubmitting, ...props }) => {
  const { t } = useTranslation();
  const buttonLabel = React.useMemo(() => {
    switch (type) {
      case "submit":
        return isSubmitting
          ? t("formButton.submitting")
          : t("formButton.submit");
      case "cancel":
        return isSubmitting
          ? t("formButton.cancelling")
          : t("formButton.cancel");
      case "reset":
        return isSubmitting ? t("formButton.resetting") : t("formButton.reset");
      case "update":
        return isSubmitting ? t("formButton.updating") : t("formButton.update");
      default:
        return isSubmitting
          ? t("formButton.submitting")
          : t("formButton.submit");
    }
  }, [type, isSubmitting, t]);

  return (
    <button
      type={type === "cancel" ? "button" : "submit"}
      className={`btn btn-${type} d-flex flex-row gap-2 `}
      disabled={isSubmitting}
      aria-label={
        isSubmitting
          ? t("formButton.ariaLabel.saving")
          : t("formButton.ariaLabel.save")
      }
      {...props}
    >
      <span className="icon-container">
        {type === "submit" && (
          <FontAwesomeIcon icon={faCheck} className="icon" />
        )}
        {type === "cancel" && (
          <FontAwesomeIcon icon={faClose} className="icon" />
        )}
      </span>
      <span className="label-container">{buttonLabel}</span>
    </button>
  );
};

FormButton.propTypes = {
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

FormButton.defaultProps = {
  type: "submit",
  isSubmitting: false,
};

export default FormButton;
