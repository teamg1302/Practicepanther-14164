import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Link } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FormButton } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  LifeBuoy,
  List,
  PlusCircle,
  Trash2,
  X,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
        assignedTo: getValidationRules(t).textOnlyRequired,
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
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Basic Information"}</h6>
            <small className="text-muted">
              {"Enter the contact's basic details"}
            </small>
          </div>
        ),
      },
      {
        id: "contactPhoto",
        col: 12,
        name: "contactPhoto",
        label: "Contact Photo",
        type: "userImage",
        required: true,
      },
      {
        id: "name",
        col: 6,
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        inputProps: {
          placeholder: "Enter the contact's name",
        },
      },
      {
        id: "registrationNumber ",
        col: 6,
        name: "registrationNumber",
        label: "Registration Number",
        type: "text",
        inputProps: {
          placeholder: "Enter  registration/case number",
        },
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
        id: "website",
        col: 6,
        name: "website",
        label: "Website",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's website",
        },
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">
              {"Contact Information"}
            </h6>
            <small className="text-muted">{"Phone numbers and emails"}</small>
          </div>
        ),
      },
      {
        id: "homePhone",
        col: 6,
        name: "homePhone",
        label: "Home Phone",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's home phone",
        },
      },
      {
        id: "mobilePhone",
        col: 6,
        name: "mobilePhone",
        label: "Mobile Phone",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's mobile phone",
        },
      },
      {
        id: "officePhone",
        col: 6,
        name: "officePhone",
        label: "Office Phone",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's office phone",
        },
      },
      {
        id: "fax",
        col: 6,
        name: "fax",
        label: "Fax",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's fax",
        },
      },
      {
        id: "email",
        col: 6,
        name: "email",
        label: "Email",
        type: "email",
        inputProps: {
          placeholder: "Enter the contact's email",
        },
      },
      {
        id: "preferredContactMethod",
        col: 6,
        name: "preferredContactMethod",
        label: "Preferred Contact Method",
        type: "select",
        options: [
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
        ],
      },
      {
        id: "contactNotes",
        col: 12,
        name: "contactNotes",
        label: "Contact Notes",
        type: "textarea",
        rows: 5,
        maxLength: 500,
        inputProps: {
          placeholder: "Enter the contact's notes",
        },
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Address"}</h6>
            <small className="text-muted">{"Contact's physical address"}</small>
          </div>
        ),
      },
      {
        id: "addressLine1",
        col: 12,
        name: "addressLine1",
        label: "Address Line 1",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's address line 1",
        },
      },
      {
        id: "addressLine2",
        col: 12,
        name: "addressLine2",
        label: "Address Line 2",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's address line 2",
        },
      },
      {
        id: "city",
        col: 6,
        name: "city",
        label: "City",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's city",
        },
      },
      {
        id: "zipCode",
        col: 6,
        name: "zipCode",
        label: "Zip/Postal Code",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's zip code",
        },
      },
      {
        id: "country",
        col: 6,
        name: "country",
        label: "Country",
        type: "select",
        options: [
          { label: "United States", value: "united_states" },
          { label: "Canada", value: "canada" },
          { label: "United Kingdom", value: "united_kingdom" },
          { label: "Australia", value: "australia" },
          { label: "New Zealand", value: "new_zealand" },
        ],
      },
      {
        id: "state",
        col: 6,
        name: "state",
        label: "State",
        type: "select",
        options: [
          { label: "California", value: "california" },
          { label: "New York", value: "new_york" },
          { label: "Texas", value: "texas" },
          { label: "Florida", value: "florida" },
          { label: "Illinois", value: "illinois" },
        ],
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">
              {"Assignment & Organization"}
            </h6>
            <small className="text-muted">
              {"Assign contact to a user and firm"}
            </small>
          </div>
        ),
      },
      {
        id: "assignedTo",
        col: 6,
        name: "assignedTo",
        label: "Assigned To",
        type: "select",
        options: [
          { label: "User 1", value: "user_1" },
          { label: "User 2", value: "user_2" },
        ],
        required: true,
      },
      {
        id: "tags",
        col: 12,
        name: "tags",
        label: "Tags",
        type: "select",
        options: [
          { label: "Tag 1", value: "tag_1" },
          { label: "Tag 2", value: "tag_2" },
        ],
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">
              {"Additional Invoice Recipients"}
            </h6>
            <small className="text-muted">
              {"Add other people who should receive invoices"}
            </small>
          </div>
        ),
      },
      {
        id: "additionalInvoiceRecipients",
        col: 12,
        name: "additionalInvoiceRecipients",
        label: "Additional Invoice Recipients",
        type: "select",
        options: [
          { label: "Recipient 1", value: "recipient_1" },
          { label: "Recipient 2", value: "recipient_2" },
        ],
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      // Remove confirmPassword before sending to API (only used for frontend validation)
      // eslint-disable-next-line no-unused-vars
      //  const { confirmPassword, ...passwordData } = data;

      // await changePassword(data);

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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>New Contact</h4>
              <h6>Create new contact</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.headers[1].path} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Back to Contacts
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
          <ContactForm fields={fields} />
        </FormProvider>

        {/* /add */}
      </div>
    </div>
  );
};

const ContactForm = ({ fields }) => {
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

ContactForm.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default MattersAddEdit;
