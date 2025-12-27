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
  t,
  size = "md",
  showCloseButton = true,
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
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          zIndex: 1050,
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
            <div className="modal-body">
              <FormProvider
                schema={schema}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
              >
                <Form fields={fields} t={t} onClose={onClose} />
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Form = ({ fields, t, onClose }) => {
  const { isSubmitting } = useFormContext();
  return (
    <div>
      <EntityFormView fields={fields} />
      <div className="d-flex flex-row gap-2 align-items-center justify-content-end">
        <FormButton isSubmitting={isSubmitting} type={"submit"} />
        <FormButton
          isSubmitting={isSubmitting}
          type={"cancel"}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  id: PropTypes.string,
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  fields: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  showCloseButton: PropTypes.bool,
};

export default FormModal;
