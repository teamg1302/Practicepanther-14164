import React, { useEffect } from "react";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";

import PropTypes from "prop-types";

import EntityFormView from "../entity-form-view";
import { FormButton } from "../buttons";

/**
 * Modal component for displaying content in a modal dialog.
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback function when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 * @param {boolean} props.showCloseButton - Show close button in header
 */
const FormModal = ({
  isOpen,
  onClose,
  title = "Modal",
  fields,
  schema,
  defaultValues,
  onSubmit,
  size = "md",
  showCloseButton = true,
  bodyStyle,
  zIndex = 1050,
}) => {
  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Add modal-open class to body for Bootstrap compatibility
      document.body.classList.add("modal-open");
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Map size to Bootstrap modal size classes
  const sizeClass =
    {
      sm: "modal-sm",
      md: "",
      lg: "modal-lg",
      xl: "modal-xl",
    }[size] || "";

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleBackdropClick}
        style={{ zIndex: zIndex - 10 }}
      />

      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          zIndex: zIndex,
        }}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden={!isOpen}
        onClick={handleBackdropClick}
      >
        <div
          className={`modal-dialog ${sizeClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="formModalLabel">
                {title}
              </h5>
              {showCloseButton && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              )}
            </div>
            <FormProvider
              schema={schema}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
            >
              <div className="modal-body" style={bodyStyle}>
                <Form fields={fields} />
              </div>
              <div className="d-flex flex-row gap-2 align-items-center justify-content-end p-3">
                <FormButtons onClose={onClose} />
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

const Form = ({ fields }) => {
  return <EntityFormView fields={fields} rowClassName="" />;
};

const FormButtons = ({ onClose }) => {
  const { isSubmitting } = useFormContext();
  return (
    <>
      <FormButton isSubmitting={isSubmitting} type={"submit"} />
      <FormButton
        isSubmitting={isSubmitting}
        type={"cancel"}
        onClick={onClose}
      />
    </>
  );
};

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  id: PropTypes.string,
};

FormButtons.propTypes = {
  onClose: PropTypes.func.isRequired,
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  fields: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  showCloseButton: PropTypes.bool,
  bodyStyle: PropTypes.object,
  zIndex: PropTypes.number,
};

export default FormModal;
