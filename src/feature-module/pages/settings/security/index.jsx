import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { FormButton } from "@/feature-module/components/buttons";
import { getValidationRules } from "@/core/validation-rules";
import { changePassword } from "@/core/services/userService";
import EntityFormView from "@/feature-module/components/entity-form-view";

const SecuritySettings = () => {
  const { t } = useTranslation();

  const securitySettingsSchema = useMemo(
    () =>
      yup.object({
        currentPassword: getValidationRules(t).passwordOnlyRequired,
        newPassword: getValidationRules(t).password,
        confirmPassword: getValidationRules(t, "newPassword").confirmPassword,
      }),
    [t]
  );

  const defaultValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const fields = useMemo(
    () => [
      {
        id: "currentPassword",
        col: 12,
        name: "currentPassword",
        label: t("formElements.currentPassword"),
        type: "password",
        required: true,
        // helpText: t("formElements.currentPasswordHelpText"),
        inputProps: {
          placeholder: t("formElements.currentPasswordPlaceholder"),
          className: "password-input",
        },
      },
      {
        id: "newPassword",
        col: 12,
        name: "newPassword",
        label: t("formElements.newPassword"),
        type: "password",
        required: true,
        // helpText: t("formElements.newPasswordHelpText"),
        inputProps: {
          placeholder: t("formElements.newPasswordPlaceholder"),
          className: "password-input",
        },
      },
      {
        id: "confirmPassword",
        col: 12,
        name: "confirmPassword",
        label: t("formElements.confirmPassword"),
        type: "password",
        required: true,
        // helpText: t("formElements.confirmPasswordHelpText"),
        inputProps: {
          placeholder: t("formElements.confirmPasswordPlaceholder"),
          className: "password-input",
        },
      },
      {
        type: "ui",
        element: (
          <div className="mt-2 small text-muted">
            <strong>Password Requirements:</strong>
            <ul className="mb-0">
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
        ),
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      // Remove confirmPassword before sending to API (only used for frontend validation)
      // eslint-disable-next-line no-unused-vars
      //  const { confirmPassword, ...passwordData } = data;

      await changePassword(data);

      Swal.fire({
        title: t("changePasswordSetting.passwordUpdatedSuccessfully"),
        icon: "success",
        timer: 1500,
      });
      event.target.reset();
    } catch (error) {
      console.log("error", error);

      const errorMessage =
        error?.message ||
        error?.error ||
        t("changePasswordSetting.passwordUpdateFailedMessage");

      Swal.fire({
        title: t("changePasswordSetting.passwordUpdateFailedMessage"),
        text: errorMessage,
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <>
      <main className="settings-content-main w-100">
        <div className="settings-page-wrap">
          <div className="setting-title">
            <h4>{t("changePasswordSetting.title")}</h4>
          </div>
          <div className="setting-description mb-4">
            <span>{t("changePasswordSetting.subtitle")}</span>
          </div>
          <FormProvider
            schema={securitySettingsSchema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          >
            <SecurityForm fields={fields} />
          </FormProvider>
        </div>
      </main>
    </>
  );
};

const SecurityForm = ({ fields }) => {
  const {
    formState: { isSubmitting },
    reset,
  } = useFormContext();

  return (
    <>
      <EntityFormView fields={fields} />
      <div className="settings-bottom-btn d-flex flex-row gap-2 align-items-center justify-content-end">
        <FormButton type="submit" isSubmitting={isSubmitting} />
        <FormButton
          type="reset"
          isSubmitting={isSubmitting}
          onClick={() => reset()}
        />
      </div>
    </>
  );
};

SecurityForm.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default SecuritySettings;
