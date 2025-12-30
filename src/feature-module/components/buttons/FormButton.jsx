import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  faClose,
  faCheck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormButton = ({ type = "submit", isSubmitting = false, ...props }) => {
  const { t } = useTranslation();
  const buttonLabel = React.useMemo(() => {
    switch (type) {
      case "submit":
        return isSubmitting
          ? t("formButton.submitting")
          : t("formButton.submit");
      case "save":
        return isSubmitting ? t("formButton.saving") : t("formButton.save");
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
      type={type === "cancel" || type === "reset" ? "button" : "submit"}
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
      {type === "reset" && (
        <FontAwesomeIcon icon={faRotateLeft} className="icon" />
      )}
      <span className="label-container">{buttonLabel}</span>
    </button>
  );
};

FormButton.propTypes = {
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

export default FormButton;
