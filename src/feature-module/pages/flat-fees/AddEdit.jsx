import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";
import PageLayout from "@/feature-module/components/list-page-layout";
import { getItems } from "@/core/services/itemService";
import { getContacts } from "@/core/services/contactsService";
import { getCategories } from "@/core/services/categoryService";
import { getMatters } from "@/core/services/mattersService";
import { FromButtonGroup } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import EntityFormView from "@/feature-module/components/entity-form-view";
import { getHours, getMinutes } from "@/core/utilities/utility";

import { useSelector } from "react-redux";

const AddEdit = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const { expenseId } = useParams();
  const entityId = expenseId || false;

  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      yup.object({
        contact: getValidationRules(t).textOnlyRequired,
        matter: getValidationRules(t).textOnlyRequired,
        price: getValidationRules(t).textOnlyRequired,
        date: getValidationRules(t).textOnlyRequired,
        item: getValidationRules(t).textOnlyRequired,
      }),
    [t]
  );

  // Get timer state from Redux
  const [defaultValues] = useState({
    contact: "",
    matter: "",
    item: "",
    date: "",
    quantity: 0,
    price: 0,
    total: 0,
    description: "",
    category: "",
    receipt: "",
    isBilled: false,
    billedBy: "",
  });

  const fields = useMemo(
    () => [
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Linked To"}</h6>
            <small className="text-muted">
              {"Enter the time entry's link to contact"}
            </small>
          </div>
        ),
      },
      {
        id: "contact",
        col: 6,
        name: "contact",
        label: "Contact",
        type: "async-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        id: "matter",
        col: 6,
        name: "matter",
        label: "Matter",
        type: "async-select-pagination",
        api: getMatters,
        labelKey: "matterName",
        valueKey: "_id",
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Expenses"}</h6>
            <small className="text-muted">
              {"Enter the expense's details"}
            </small>
          </div>
        ),
      },
      {
        id: "item",
        col: 6,
        name: "item",
        label: "Item",
        type: "async-select-pagination",
        api: getItems,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        id: "date",
        col: 6,
        name: "date",
        label: "Date",
        type: "date",
      },
      {
        id: "quantity",
        col: 3,
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: true,
      },
      {
        id: "price",
        col: 3,
        name: "price",
        label: "Price",
        type: "number",
        required: true,
      },
      {
        id: "total",
        col: 3,
        name: "total",
        label: "Total",
        type: "number",
        required: true,
      },
      {
        id: "description",
        col: 12,
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },

      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Billings"}</h6>
            <small className="text-muted">
              {"Enter the time entry's billing details"}
            </small>
          </div>
        ),
      },
      {
        id: "isBilled",
        col: 6,
        name: "isBilled",
        label: "Is Billed",
        type: "switch",
      },
      {
        id: "billedBy",
        col: 6,
        name: "billedBy",
        label: "Billed By",
        type: "async-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      console.log("data", data);
      //   const formData = convertToFormData(data);
      //   if (timeEntryId) {
      //     // Update existing contact
      //     await updateTimeEntry(timeEntryId, formData);
      //     Swal.fire({
      //       title:
      //         t("httpMessages.updatedSuccessfullyMessage") ||
      //         "Updated Successfully",
      //       icon: "success",
      //       timer: 1500,
      //     });
      //   } else {
      //     // Create new contact
      //     await createContact(formData);
      //     Swal.fire({
      //       title: t("httpMessages.createdSuccessfullyMessage"),
      //       icon: "success",
      //       timer: 1500,
      //     });
      //     event.target.reset();
      //   }
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
          label: "Time Entries",
          redirect: route.headers[3].path,
        },
        {
          label: entityId ? "Edit Expense" : "Add Expense",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      title={entityId ? "Edit Expense" : "Add Expense"}
      subtitle={entityId ? "Modify expense details" : "Create a new expense"}
      actions={{
        onPrevious: {
          text: "Back to Time Entries",
          onClick: () => navigate(route.headers[3].path),
        },
      }}
    >
      <FormProvider
        schema={validationSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      >
        <AddEditForm fields={fields} entityId={entityId} t={t} />
      </FormProvider>
    </PageLayout>
  );
};
const AddEditForm = ({ fields, entityId, t }) => {
  const {
    formState: { isSubmitting },
    reset,
    setValue,
  } = useFormContext();

  // Sync Redux timer state with form
  const timerTotalTime = useSelector(
    (state) => state.timer?.totalTime || "00:00:00"
  );

  useEffect(() => {
    // Update form's totalTime when Redux timer state changes
    setValue("totalTime", timerTotalTime, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [timerTotalTime, setValue]);

  useEffect(() => {
    if (entityId) {
      //   const fetchTimeEntry = async () => {
      //     try {
      //       const timeEntry = await getTimeEntryById(timeEntryId);
      //       // Transform the API response to match form structure
      //       const formData = {
      //         image: timeEntry?.image || "",
      //         name: timeEntry?.name || "",
      //         registrationNumber: timeEntry?.registrationNumber || "",
      //         status: contact?.status || "",
      //         website: contact?.website || "",
      //         phoneHome: contact?.phoneHome || "",
      //         phoneMobile: contact?.phoneMobile || "",
      //         phoneOffice: contact?.phoneOffice || "",
      //         fax: contact?.fax || "",
      //         email: contact?.email || "",
      //         preferredContactMethod: contact?.preferredContactMethod || "",
      //         contactNotes: contact?.contactNotes || "",
      //         address1: contact?.address1 || "",
      //         addressLine2: contact?.address2 || contact?.addressLine2 || "",
      //         city: contact?.city || "",
      //         zipCode: contact?.zipCode || "",
      //         countryId: contact?.countryId?._id || contact?.countryId || "",
      //         stateId: contact?.stateId?._id || contact?.stateId || "",
      //         assignedTo: contact?.assignedTo?._id || contact?.assignedTo || "",
      //         tags: contact?.tags || [],
      //         additionalInvoiceRecipients:
      //           contact?.additionalInvoiceRecipients?.map(
      //             (recipient) => recipient._id || recipient
      //           ) || [],
      //       };
      //       // Use setTimeout to ensure form fields are fully mounted
      //       setTimeout(() => {
      //         // Reset form with options to ensure values are set
      //         reset(formData, {
      //           keepDefaultValues: false,
      //           keepValues: false,
      //         });
      //         // Also use setValue for all fields to ensure they update
      //         Object.keys(formData).forEach((key) => {
      //           setValue(key, formData[key], {
      //             shouldValidate: false,
      //             shouldDirty: false,
      //             shouldTouch: false,
      //           });
      //         });
      //       }, 100);
      //     } catch (error) {
      //       console.log("error", error);
      //       Swal.fire({
      //         text: error?.message || t("httpMessages.errorMessage"),
      //         icon: "error",
      //         timer: 1500,
      //       });
      //     }
      //   };
      //   fetchTimeEntry();
    }
  }, [entityId, reset, setValue, t]);

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

AddEditForm.propTypes = {
  fields: PropTypes.array.isRequired,
  entityId: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default AddEdit;
