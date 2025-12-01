import React from "react";
import { useFormContext } from "react-hook-form";
import { PlusCircle, Trash2 } from "feather-icons-react/build/IconComponents";
import PropTypes from "prop-types";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * File Upload component.
 * Reusable file upload component for React Hook Form.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for React Hook Form registration
 * @param {string|React.ReactNode} props.label - Label text or translation key
 * @param {string|React.ReactNode} [props.changeText] - Text for change button/link
 * @param {string|React.ReactNode} [props.helpText] - Help text below the input
 * @param {string} [props.accept] - Accepted file types (e.g., "image/*", ".pdf")
 * @param {string} [props.className] - Additional CSS classes for wrapper
 * @param {string} [props.inputClassName] - Additional CSS classes for input wrapper
 * @param {boolean} [props.showFileName=true] - Whether to show selected file name
 * @param {Object} [props.registerOptions] - Additional options for react-hook-form register
 * @returns {JSX.Element} File upload section
 *
 * @example
 * // Basic usage
 * <PhotoUpload
 *   name="profilePhoto"
 *   label="Profile Photo"
 *   accept="image/*"
 * />
 *
 * @example
 * // With translations
 * <PhotoUpload
 *   name="profilePhoto"
 *   label={t("personalSettings.profilePhoto")}
 *   changeText={t("personalSettings.changeImage")}
 *   helpText={t("personalSettings.imageUploadHelp")}
 * />
 */
const PhotoUpload = ({
  name,
  label,
  changeText = "Change Image",
  helpText,
  accept = "image/*",
  className = "",
  inputClassName = "",
  showFileName = true,
  registerOptions = {},
  previewImageUrl,
}) => {
  const { watch, setValue } = useFormContext();
  const fileValue = watch(name);
  const [previewUrl, setPreviewUrl] = React.useState(previewImageUrl || null);

  // Handle file change - set single file (not FileList)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file instanceof File) {
      setValue(name, file, { shouldValidate: true });
    } else {
      setValue(name, null);
    }
  };

  // Create preview URL when file is selected
  React.useEffect(() => {
    if (fileValue && fileValue instanceof File) {
      const objectUrl = URL.createObjectURL(fileValue);
      setPreviewUrl(objectUrl);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (!fileValue) {
      // Reset to previewImageUrl if no file is selected
      setPreviewUrl(previewImageUrl || null);
    }
  }, [fileValue, previewImageUrl]);

  // Handle remove button click
  const handleRemove = () => {
    setValue(name, null);
    setPreviewUrl(previewImageUrl || null);
  };

  const hasPreview = previewUrl || (fileValue && fileValue instanceof File);

  return (
    <div
      className={`profile-pic-upload ${className} ${
        hasPreview ? "edit-pic" : ""
      }`}
    >
      <div className="profile-pic">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ) : (
          <span>
            <PlusCircle className="plus-down-add" />
            {label}
          </span>
        )}
      </div>
      <div className={`new-employee-field ${inputClassName}`}>
        <div className="mb-0 d-flex gap-2">
          <div className="image-upload mb-0">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              {...registerOptions}
            />
            <div className="image-uploads">
              <h4>
                <FontAwesomeIcon icon={faUndo} className="info-img" />
                {changeText}
              </h4>
            </div>
          </div>
          {hasPreview && (
            <button
              type="button"
              className="btn btn-danger text-white border-radius-5 d-flex  justify-content-center gap-2"
              style={{ borderRadius: "5px !important" }}
              onClick={handleRemove}
            >
              <Trash2 className="info-img" size={16} />{" "}
              <span className="text-white mt-0">Remove</span>
            </button>
          )}

          {showFileName && fileValue && fileValue instanceof File && (
            <div className="mt-2">
              <small className="text-muted">Selected: {fileValue.name}</small>
            </div>
          )}
        </div>
        <span className="text-muted small">{helpText}</span>
      </div>
    </div>
  );
};

PhotoUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  changeText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  accept: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  showFileName: PropTypes.bool,
  registerOptions: PropTypes.object,
  previewImageUrl: PropTypes.string,
};

PhotoUpload.defaultProps = {
  changeText: "Change Image",
  helpText: undefined,
  accept: "image/*",
  className: "",
  inputClassName: "",
  showFileName: true,
  registerOptions: {},
  previewImageUrl: undefined,
};

export default PhotoUpload;
