import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { Input, Select } from "@/feature-module/components/form-elements";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import DatePicker from "@/feature-module/components/form-elements/datepicker";
import { FormButton } from "@/feature-module/components/buttons";

const EntityFormView = ({ schema, defaultValues, fields, onSubmit }) => {
  const formFields = useMemo(() => {
    return fields && fields.length > 0
      ? fields.map((field) => {
          const { id, name, label, type, col, ...rest } = field;
          // Check if type is one of the input types
          const isInputType = [
            "text",
            "email",
            "number",
            "password",
            "tel",
            "url",
          ].includes(type);

          if (isInputType) {
            return (
              <div key={id} className={`col-md-${col || 12}`}>
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

          if (type === "select") {
            return (
              <div key={id} className={`col-md-${col || 12}`}>
                <Select name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "userImage") {
            return (
              <div key={id} className={`col-md-${col || 12}`}>
                <PhotoUpload name={name} label={label} {...rest} />
              </div>
            );
          }

          if (type === "datepicker") {
            return (
              <div key={id} className={`col-md-${col || 12}`}>
                <DatePicker name={name} label={label} {...rest} />
              </div>
            );
          }

          // Default to text input for unknown types
          return (
            <div key={id} className={`col-md-${col || 12}`}>
              <Input id={id} name={name} label={label} type="text" {...rest} />
            </div>
          );
        })
      : [
          <div key="empty-form">
            <p>No fields to display</p>
          </div>,
        ];
  }, [fields]);

  return (
    <FormProvider
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    >
      <div className="row">{formFields}</div>
      <FormSubmitButtons />
    </FormProvider>
  );
};

/**
 * Form submit buttons component.
 * Uses form context to access submission state.
 *
 * @returns {JSX.Element} Submit and cancel buttons
 */
const FormSubmitButtons = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="settings-bottom-btn d-flex flex-row gap-2 align-items-center justify-content-end">
      <FormButton type="submit" isSubmitting={isSubmitting} />
      <FormButton type="cancel" isSubmitting={isSubmitting} />
    </div>
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
