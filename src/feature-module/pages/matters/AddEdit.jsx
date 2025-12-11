import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { convertToFormData } from "@/core/utilities/formDataConverter";
import { getUsers } from "@/core/services/userService";
import { getTags } from "@/core/services/tagService";
import { getContacts } from "@/core/services/contactsService";
import {
  getMatterById,
  createMatter,
  updateMatter,
} from "@/core/services/mattersService";
import { FormButton } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import { all_routes } from "@/Router/all_routes";

import { setToogleHeader } from "@/core/redux/action";

import EntityFormView from "@/feature-module/components/entity-form-view";

const MattersAddEdit = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const { matterId } = useParams();
  const data = useSelector((state) => state.toggle_header);

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>{matterId ? "Edit Matter" : "New Matter"}</h4>
              <h6>
                {matterId ? "Update matter details" : "Create new matter"}
              </h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.headers[2].path} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Back to Matters
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Collapse"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => {
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>

        <FormProvider
          schema={securitySettingsSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        >
          <MattersForm fields={fields} matterId={matterId || false} t={t} />
        </FormProvider>

        {/* /add */}
      </div>
    </div>
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
      <div className="card">
        <div className="card-body add-product pb-0">
          <EntityFormView fields={fields} />
        </div>
      </div>
      <div className="col-lg-12">
        <div className="mb-4 d-flex justify-content-end gap-2">
          <FormButton type="submit" isSubmitting={isSubmitting} />
          <FormButton
            type="cancel"
            isSubmitting={isSubmitting}
            onClick={() => reset()}
          />
        </div>
      </div>
    </>
  );
};

MattersForm.propTypes = {
  fields: PropTypes.array.isRequired,
  matterId: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default MattersAddEdit;
