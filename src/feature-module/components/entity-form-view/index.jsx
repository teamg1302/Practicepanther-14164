import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Input,
  Select,
  RichTextEditor,
} from "@/feature-module/components/form-elements";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import DatePicker from "@/feature-module/components/form-elements/datepicker";
import Textarea from "@/feature-module/components/form-elements/textarea";
import MasterPicker from "@/feature-module/components/form-elements/master-picker";
import ApiSelect from "@/feature-module/components/form-elements/api-select";
import AsyncSelectPagination from "@/feature-module/components/form-elements/async-select-pagination";
import AsyncMultiSelectPagination from "@/feature-module/components/form-elements/async-multi-select-pagination";
import Switch from "@/feature-module/components/form-elements/switch";

const EntityFormView = ({ fields, rowClassName = "my-3" }) => {
  const formFields = useMemo(() => {
    return fields && fields.length > 0
      ? fields.map((field, index) => {
          const {
            id,
            name,
            label,
            type,
            col,
            element,
            className = "",
            ...rest
          } = field;
          // Use id, name, or index as key fallback
          const fieldKey = id || name || `field-${index}`;
          // Check for switch first (before input types)
          if (type === "switch") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <Switch name={name} label={label} {...rest} />
              </div>
            );
          }

          // Check if type is one of the input types
          const isInputType = [
            "text",
            "email",
            "date",
            "number",
            "password",
            "tel",
            "url",
          ].includes(type);

          if (isInputType) {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <Input
                  id={id}
                  name={name}
                  label={label}
                  type={type}
                  {...rest}
                />
              </div>
            );
          }

          if (type === "textarea") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <Textarea name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "select") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <Select name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "master") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <MasterPicker name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "userImage") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <PhotoUpload name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "datepicker") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <DatePicker name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "api") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <ApiSelect name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "async-select-pagination") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <AsyncSelectPagination name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "async-multi-select-pagination") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <AsyncMultiSelectPagination
                  name={name}
                  label={label}
                  {...rest}
                />
              </div>
            );
          }

          if (type === "rich-text-editor") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                <RichTextEditor name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "ui") {
            return (
              <div key={fieldKey} className={`col-md-${col || 12} ${className}`}>
                {element}
              </div>
            );
          }
        })
      : [
          <div key="empty-form">
            <p>No fields to display</p>
          </div>,
        ];
  }, [fields]);

  return (
    <>
      <div className={`row ${rowClassName}`}>{formFields}</div>
    </>
  );
};

EntityFormView.propTypes = {
  fields: PropTypes.array.isRequired,
  rowClassName: PropTypes.string,
};

export default EntityFormView;
