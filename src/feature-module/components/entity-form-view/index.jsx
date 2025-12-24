import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Input, Select } from "@/feature-module/components/form-elements";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import DatePicker from "@/feature-module/components/form-elements/datepicker";
import Textarea from "@/feature-module/components/form-elements/textarea";
import MasterPicker from "@/feature-module/components/form-elements/master-picker";
import ApiSelect from "@/feature-module/components/form-elements/api-select";
import AsyncSelectPagination from "@/feature-module/components/form-elements/async-select-pagination";
import AsyncMultiSelectPagination from "@/feature-module/components/form-elements/async-multi-select-pagination";
import Switch from "@/feature-module/components/form-elements/switch";

const EntityFormView = ({ fields }) => {
  const formFields = useMemo(() => {
    return fields && fields.length > 0
      ? fields.map((field) => {
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
          // Check for switch first (before input types)
          if (type === "switch") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
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
              <div key={id} className={`col-md-${col || 12} ${className}`}>
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
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <Textarea name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "select") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <Select name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "master") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <MasterPicker name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "userImage") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <PhotoUpload name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "datepicker") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <DatePicker name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "api") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <ApiSelect name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "async-select-pagination") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <AsyncSelectPagination name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "async-multi-select-pagination") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
                <AsyncMultiSelectPagination
                  name={name}
                  label={label}
                  {...rest}
                />
              </div>
            );
          }

          if (type === "ui") {
            return (
              <div key={id} className={`col-md-${col || 12} ${className}`}>
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
      <div className="row my-3">{formFields}</div>
    </>
  );
};

EntityFormView.propTypes = {
  schema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

EntityFormView.defaultProps = {
  defaultValues: {},
  fields: [],
  children: null,
};

export default EntityFormView;
