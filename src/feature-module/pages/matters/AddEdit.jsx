import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";
import PageLayout from "@/feature-module/components/list-page-layout";
import { getUsers } from "@/core/services/userService";
import { getTags } from "@/core/services/tagService";
import { getContacts } from "@/core/services/contactsService";
import { FromButtonGroup } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import EntityFormView from "@/feature-module/components/entity-form-view";
import {
  getMatterById,
  createMatter,
  updateMatter,
} from "@/core/services/mattersService";

const MattersAddEdit = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const { matterId } = useParams();

  const { t } = useTranslation();

  const securitySettingsSchema = useMemo(
    () =>
      yup.object({
        matterName: getValidationRules(t).textOnlyRequired,
        contactId: getValidationRules(t).textOnlyRequired,
        assignedTo: getValidationRules(t).textOnlyRequired,
      }),
    [t]
  );

  const [defaultValues] = useState({
    matterName: "",
    matterNumber: "",
    contactId: "",
    status: "",
    notes: "",
    matterRate: "",
    userHourlyRate: "",
    invoiceTemplate: "",
    isEvergreenRetainer: false,
    evergreenRetainerRate: "",
    isAddRetainerToInvoice: false,
    openDate: "",
    closeDate: "",
    statuteOfLimitations: "",
    assignedTo: "",
    originatingAttorney: "",
    tags: [],
    additionalInvoiceRecipients: [],
  });

  const fields = useMemo(
    () => [
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Basic Information"}</h6>
            <small className="text-muted">
              {"Enter the matter's basic details"}
            </small>
          </div>
        ),
      },

      {
        id: "matterName",
        col: 6,
        name: "matterName",
        label: "Matter Name",
        type: "text",
        required: true,
        inputProps: {
          placeholder: "Enter the matter's name",
        },
      },
      {
        id: "matterNumber ",
        col: 6,
        name: "matterNumber",
        label: "Matter Number",
        type: "text",
        inputProps: {
          placeholder: "Enter  matter number",
        },
      },
      {
        id: "contactId",
        col: 6,
        name: "contactId",
        label: "Contact",
        type: "async-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        id: "status",
        col: 6,
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
      },
      {
        id: "notes",
        col: 12,
        name: "notes",
        label: "Notes",
        type: "textarea",
        rows: 5,
        maxLength: 500,
        inputProps: {
          placeholder: "Enter any notes about the matter",
        },
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">
              {"Financial Information"}
            </h6>
            <small className="text-muted">
              {"Matter rates and billing details"}
            </small>
          </div>
        ),
      },
      {
        id: "matterRate ",
        col: 6,
        name: "matterRate",
        label: "Matter Rate",
        type: "text",
        inputProps: {
          placeholder: "Enter the matter's rate",
        },
      },
      {
        id: "userHourlyRate ",
        col: 6,
        name: "userHourlyRate",
        label: "User Hourly Rate",
        type: "text",
        inputProps: {
          placeholder: "Enter the user's hourly rate",
        },
      },
      {
        id: "invoiceTemplate",
        col: 6,
        name: "invoiceTemplate",
        label: "Invoice Template",
        type: "select",
        options: [
          { label: "Template 1", value: "template1" },
          { label: "Template 2", value: "template2" },
        ],
      },
      {
        id: "isEvergreenRetainer",
        col: 6,
        name: "isEvergreenRetainer",
        label: "Is Evergreen Retainer",
        type: "switch",
      },
      {
        id: "evergreenRetainerRate",
        col: 6,
        name: "evergreenRetainerRate",
        label: "Evergreen Retainer Rate",
        type: "text",
        inputProps: {
          placeholder: "Enter the evergreen retainer rate",
        },
      },
      {
        id: "isAddRetainerToInvoice",
        col: 6,
        name: "isAddRetainerToInvoice",
        label: "Add Retainer to Invoice",
        type: "switch",
      },
      {
        id: "additionalInvoiceRecipients",
        col: 12,
        name: "additionalInvoiceRecipients",
        label: "Additional Invoice Recipients",
        type: "async-multi-select-pagination",
        api: getUsers,
        pageSize: 50,
        searchKey: "search",
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Important Dates"}</h6>
            <small className="text-muted">
              {"Matter timeline and deadlines"}
            </small>
          </div>
        ),
      },
      {
        id: "openDate",
        col: 4,
        name: "openDate",
        label: "Open Date",
        type: "date",
      },
      {
        id: "closeDate",
        col: 4,
        name: "closeDate",
        label: "Close Date",
        type: "date",
      },
      {
        id: "statuteOfLimitations",
        col: 4,
        name: "statuteOfLimitations",
        label: "Statute of Limitations Date",
        type: "date",
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">
              {"Assignment & Organization"}
            </h6>
            <small className="text-muted">
              {"Assign matter to users and firm"}
            </small>
          </div>
        ),
      },
      {
        id: "assignedTo",
        col: 6,
        name: "assignedTo",
        label: "Assigned To",
        type: "async-select-pagination",
        api: getUsers,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        id: "originatingAttorney",
        col: 6,
        name: "originatingAttorney",
        label: "Originating Attorney",
        type: "async-select-pagination",
        api: getUsers,
        pageSize: 50,
        searchKey: "search",
      },
      {
        id: "tags",
        col: 12,
        name: "tags",
        label: "Tags",
        type: "async-multi-select-pagination",
        api: getTags,
        pageSize: 50,
        searchKey: "search",
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      //  const formData = convertToFormData(data);

      if (matterId) {
        // Update existing matter
        await updateMatter(matterId, data);
        Swal.fire({
          title:
            t("httpMessages.updatedSuccessfullyMessage") ||
            "Updated Successfully",
          icon: "success",
          timer: 1500,
        });
      } else {
        // Create new matter
        await createMatter(data);
        Swal.fire({
          title: t("httpMessages.createdSuccessfullyMessage"),
          icon: "success",
          timer: 1500,
        });
        event.target.reset();
      }
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
    <PageLayout
      breadcrumbs={[
        {
          label: "Matters",
          redirect: route.headers[2].path,
        },
        {
          label: matterId ? "Edit Matter" : "Add Matter",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      title={matterId ? "Edit Matter" : "Add Matter"}
      subtitle={matterId ? "Modify matter details" : "Create a new matter"}
      actions={{
        onPrevious: {
          text: "Back to Matters",
          onClick: () => navigate(route.headers[2].path),
        },
      }}
    >
      <FormProvider
        schema={securitySettingsSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      >
        <MattersForm fields={fields} matterId={matterId || false} t={t} />
      </FormProvider>
    </PageLayout>
  );
};

const MattersForm = ({ fields, matterId, t }) => {
  const {
    formState: { isSubmitting },
    reset,
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (matterId) {
      const fetchMatter = async () => {
        try {
          const matter = await getMatterById(matterId);

          // Transform the API response to match form structure
          const formData = {
            matterName: matter?.matterName || "",
            matterNumber: matter?.matterNumber || "",
            contactId: matter?.contactId?._id || matter?.contactId || "",
            status: matter?.status || "",
            notes: matter?.notes || "",
            matterRate: matter?.matterRate || "",
            userHourlyRate: matter?.userHourlyRate || "",
            invoiceTemplate: matter?.invoiceTemplate || "",
            isEvergreenRetainer: matter?.isEvergreenRetainer || false,
            evergreenRetainerRate: matter?.evergreenRetainerRate || "",
            isAddRetainerToInvoice: matter?.isAddRetainerToInvoice || false,
            openDate: matter?.openDate || "",
            closeDate: matter?.closeDate || "",
            statuteOfLimitations: matter?.statuteOfLimitations || "",
            assignedTo: matter?.assignedTo?._id || matter?.assignedTo || "",
            originatingAttorney:
              matter?.originatingAttorney?._id ||
              matter?.originatingAttorney ||
              "",
            tags: matter?.tags || [],
            additionalInvoiceRecipients:
              matter?.additionalInvoiceRecipients?.map(
                (recipient) => recipient._id || recipient
              ) || [],
          };

          // Use setTimeout to ensure form fields are fully mounted
          setTimeout(() => {
            // Reset form with options to ensure values are set
            reset(formData, {
              keepDefaultValues: false,
              keepValues: false,
            });

            // Also use setValue for all fields to ensure they update
            Object.keys(formData).forEach((key) => {
              setValue(key, formData[key], {
                shouldValidate: false,
                shouldDirty: false,
                shouldTouch: false,
              });
            });
          }, 100);
        } catch (error) {
          console.log("error", error);
          Swal.fire({
            text: error?.message || t("httpMessages.errorMessage"),
            icon: "error",
            timer: 1500,
          });
        }
      };
      fetchMatter();
    }
  }, [matterId, reset, setValue, t]);

  return (
    <>
      <EntityFormView fields={fields} />
      <FromButtonGroup
        isSubmitting={isSubmitting}
        reset={reset}
        onClick={(e) => console.log("e", e)}
      />
    </>
  );
};

MattersForm.propTypes = {
  fields: PropTypes.array.isRequired,
  matterId: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default MattersAddEdit;
