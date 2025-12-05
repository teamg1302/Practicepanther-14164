import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Swal from "sweetalert2";
import { getValidationRules } from "@/core/validation-rules";
import { changePassword } from "@/core/services/userService";
import EntityFormView from "@/feature-module/components/entity-form-view";

const SecuritySettings = () => {
  const { t } = useTranslation();
  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending to API (only used for frontend validation)
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...passwordData } = data;

      await changePassword(passwordData);

      Swal.fire({
        title: t("securitySettings.passwordUpdatedSuccessfully"),
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        t("securitySettings.passwordUpdateFailedMessage");

      Swal.fire({
        title: t("securitySettings.passwordUpdateFailed"),
        text: errorMessage,
        icon: "error",
        timer: 1500,
      });
    }
  };
  const securitySettingsSchema = useMemo(
    () =>
      yup.object({
        currentPassword: getValidationRules(t).passwordOnlyRequired,
        newPassword: getValidationRules(t).password,
        confirmPassword: getValidationRules(t, "newPassword").confirmPassword,
      }),
    [t]
  );

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
    ],
    [t]
  );

  return (
    <main className="settings-content-main w-100">
      <div className="settings-page-wrap">
        <EntityFormView
          schema={securitySettingsSchema}
          defaultValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          fields={fields}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
};

export default SecuritySettings;
