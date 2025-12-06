import * as yup from "yup";

/**
 * Get validation rules with translations.
 * @param {Function} t - Translation function from useTranslation hook
 * @param {string} [passwordField=""] - Field name to match for confirmPassword validation
 * @returns {Object} Object containing validation rule schemas
 */
export const getValidationRules = (t, passwordField = "") => {
  // Base confirmPassword schema
  let confirmPasswordSchema = yup
    .string()
    .trim()
    .required(t("formElements.validation.required"));

  // Only add oneOf validation if passwordField is provided
  if (passwordField && passwordField.trim() !== "") {
    confirmPasswordSchema = confirmPasswordSchema.oneOf(
      [yup.ref(passwordField)],
      t("formElements.validation.match")
    );
  }

  return {
    textOnlyRequired: yup
      .string()
      .trim()
      .required(t("formElements.validation.required")),
    passwordOnlyRequired: yup
      .string()
      .trim()
      .required(t("formElements.validation.required")),
    password: yup
      .string()
      .trim()
      .min(8, () => t("formElements.validation.minLength", { min: 8 }))
      .max(16, () => t("formElements.validation.maxLength", { max: 16 }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("formElements.validation.invalid")
      )
      .required(t("formElements.validation.required")),
    confirmPassword: confirmPasswordSchema,
  };
};
