import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { clearCountriesError, fetchCountries } from "@/core/redux/countries";
import { getStatesByCountry } from "@/core/services/mastersService";
import { getUsers } from "@/core/services/userService";
import { getTags } from "@/core/services/tagService";
import { getContacts } from "@/core/services/contactsService";
import { FormButton } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { createContact } from "@/core/services/contactsService";
import { getValidationRules } from "@/core/validation-rules";
import { all_routes } from "@/Router/all_routes";

import { setToogleHeader } from "@/core/redux/action";

import EntityFormView from "@/feature-module/components/entity-form-view";

const MattersAddEdit = () => {
  const route = all_routes;
  const dispatch = useDispatch();

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
        name: getValidationRules(t).textOnlyRequired,
        registrationNumber: getValidationRules(t).textOnlyRequired,
        country: getValidationRules(t).textOnlyRequired,
        assignedTo: getValidationRules(t).textOnlyRequired,
      }),
    [t]
  );

  const defaultValues = {
    contactPhoto: "",
    name: "",
    registrationNumber: "",
    status: "",
    website: "",
    homePhone: "",
    mobilePhone: "",
    officePhone: "",
    fax: "",
    email: "",
    preferredContactMethod: "",
    contactNotes: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    country: "",
    state: "",
    assignedTo: "",
    tags: [],
    additionalInvoiceRecipients: [],
  };

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
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      await createContact(data);

      Swal.fire({
        title: t("httpMessages.createdSuccessfullyMessage"),
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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>New Matter</h4>
              <h6>Create new matter</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.headers[1].path} className="btn btn-secondary">
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
          <MattersForm fields={fields} />
        </FormProvider>

        {/* /add */}
      </div>
    </div>
  );
};

const MattersForm = ({ fields }) => {
  const {
    formState: { isSubmitting },
    reset,
  } = useFormContext();

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
};

export default MattersAddEdit;
