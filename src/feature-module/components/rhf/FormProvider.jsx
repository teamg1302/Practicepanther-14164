/**
 * Form Provider component for React Hook Form.
 * @module feature-module/components/rhf/FormProvider
 *
 * Provides a wrapper component that integrates React Hook Form's FormProvider
 * with Yup validation resolver. This component simplifies form setup and
 * provides consistent form handling across the application.
 *
 * Features:
 * - Integrated with React Hook Form
 * - Yup validation support
 * - Consistent form configuration
 * - Error handling
 * - Loading states
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * FormProvider component props.
 * @typedef {Object} FormProviderProps
 * @property {Object} schema - Yup validation schema
 * @property {Object} [defaultValues={}] - Default form values
 * @property {string} [mode="onBlur"] - Validation mode (onBlur, onChange, onSubmit, etc.)
 * @property {Function} onSubmit - Form submission handler
 * @property {React.ReactNode} children - Form content
 * @property {Object} [formOptions={}] - Additional react-hook-form options
 */

/**
 * Form Provider component that wraps React Hook Form with Yup validation.
 *
 * @param {FormProviderProps} props - Component props
 * @returns {JSX.Element} Form provider with form context
 *
 * @example
 * // Basic usage
 * <FormProvider
 *   schema={validationSchema}
 *   defaultValues={{ firstName: "", lastName: "" }}
 *   onSubmit={handleSubmit}
 * >
 *   <Input name="firstName" label="First Name" required />
 *   <Input name="lastName" label="Last Name" required />
 *   <button type="submit">Submit</button>
 * </FormProvider>
 *
 * @example
 * // With custom validation mode
 * <FormProvider
 *   schema={validationSchema}
 *   mode="onChange"
 *   onSubmit={handleSubmit}
 * >
 *   {/* form fields *\/}
 * </FormProvider>
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const FormProvider = ({
  schema,
  defaultValues = {},
  mode = "onBlur",
  onSubmit,
  children,
  formOptions = {},
}) => {
  const methods = useForm({
    mode,
    resolver: yupResolver(schema),
    defaultValues,
    ...formOptions,
  });

  const { handleSubmit } = methods;

  /**
   * Handles form submission with error handling.
   *
   * @param {Object} data - Form data
   * @param {Object} event - Form event
   * @returns {Promise<void>}
   */
  const handleFormSubmit = async (data, event) => {
    try {
      await onSubmit(data, event);
    } catch (error) {
      // Error handling is typically done in the onSubmit function
      // This catch block is for any unhandled errors
      console.error("Form submission error:", error);
    }
  };

  return (
    <RHFFormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        aria-label="Form"
      >
        {children}
      </form>
    </RHFFormProvider>
  );
};

FormProvider.propTypes = {
  schema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  mode: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  formOptions: PropTypes.object,
};

export default FormProvider;
