import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-bootstrap";

import { all_routes } from "@/Router/all_routes";
import PageLayout from "@/feature-module/components/list-page-layout";
import { convertToFormData } from "@/core/utilities/formDataConverter";
import { clearCountriesError, fetchCountries } from "@/core/redux/countries";
import { getStatesByCountry } from "@/core/services/mastersService";
import { getUsers } from "@/core/services/userService";
import { getTags } from "@/core/services/tagService";
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
} from "@/core/services/contactsService";
import { FromButtonGroup } from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import EntityFormView from "@/feature-module/components/entity-form-view";

const ContactsAddEdit = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const { contactId } = useParams();

  const { t } = useTranslation();

  const securitySettingsSchema = useMemo(
    () =>
      yup.object({
        name: getValidationRules(t).textOnlyRequired,
        registrationNumber: getValidationRules(t).textOnlyRequired,
        countryId: getValidationRules(t).textOnlyRequired,
        assignedTo: getValidationRules(t).textOnlyRequired,
      }),
    [t]
  );

  const [defaultValues] = useState({
    image: "",
    name: "",
    registrationNumber: "",
    status: "",
    website: "",
    phoneHome: "",
    phoneMobile: "",
    phoneOffice: "",
    fax: "",
    email: "",
    preferredContactMethod: "",
    contactNotes: "",
    address1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    countryId: "",
    stateId: "",
    assignedTo: "",
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
              {"Enter the contact's basic details"}
            </small>
          </div>
        ),
      },
      {
        id: "image",
        col: 12,
        name: "image",
        label: "Contact's Image",
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
        id: "phoneHome",
        col: 6,
        name: "phoneHome",
        label: "Home Phone",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's home phone",
        },
      },
      {
        id: "phoneMobile",
        col: 6,
        name: "phoneMobile",
        label: "Mobile Phone",
        type: "text",
        inputProps: {
          placeholder: "Enter the contact's mobile phone",
        },
      },
      {
        id: "phoneOffice",
        col: 6,
        name: "phoneOffice",
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
        id: "address1",
        col: 12,
        name: "address1",
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
        id: "countryId",
        col: 6,
        name: "countryId",
        label: "Country",
        type: "master",
        action: fetchCountries,
        clearError: clearCountriesError,
        dataKey: "country",
        required: true,
      },
      {
        id: "stateId",
        col: 6,
        name: "stateId",
        label: "State",
        type: "api",
        isDependent: true,
        dependentKey: "countryId",
        api: getStatesByCountry,
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
        type: "async-select-pagination",
        api: getUsers,
        pageSize: 50,
        searchKey: "search",
        required: true,
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
        type: "async-multi-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      const formData = convertToFormData(data);

      if (contactId) {
        // Update existing contact
        await updateContact(contactId, formData);
        Swal.fire({
          title:
            t("httpMessages.updatedSuccessfullyMessage") ||
            "Updated Successfully",
          icon: "success",
          timer: 1500,
        });
      } else {
        // Create new contact
        await createContact(formData);
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
          label: "Contacts",
          redirect: route.headers[1].path,
        },
        {
          label: contactId ? "Edit Contact" : "Add Contact",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      title={contactId ? "Edit Contact" : "Add Contact"}
      subtitle={contactId ? "Modify contact details" : "Create a new contact"}
      actions={{
        onPrevious: {
          text: "Back to Contacts",
          onClick: () => navigate(route.headers[1].path),
        },
      }}
    >
      <FormProvider
        schema={securitySettingsSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      >
        <ContactForm fields={fields} contactId={contactId || false} t={t} />
      </FormProvider>
    </PageLayout>
  );
};
const ContactForm = ({ fields, contactId, t }) => {
  const {
    formState: { isSubmitting },
    reset,
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (contactId) {
      const fetchContact = async () => {
        try {
          const contact = await getContactById(contactId);

          // Transform the API response to match form structure
          const formData = {
            image: contact?.image || "",
            name: contact?.name || "",
            registrationNumber: contact?.registrationNumber || "",
            status: contact?.status || "",
            website: contact?.website || "",
            phoneHome: contact?.phoneHome || "",
            phoneMobile: contact?.phoneMobile || "",
            phoneOffice: contact?.phoneOffice || "",
            fax: contact?.fax || "",
            email: contact?.email || "",
            preferredContactMethod: contact?.preferredContactMethod || "",
            contactNotes: contact?.contactNotes || "",
            address1: contact?.address1 || "",
            addressLine2: contact?.address2 || contact?.addressLine2 || "",
            city: contact?.city || "",
            zipCode: contact?.zipCode || "",
            countryId: contact?.countryId?._id || contact?.countryId || "",
            stateId: contact?.stateId?._id || contact?.stateId || "",
            assignedTo: contact?.assignedTo?._id || contact?.assignedTo || "",
            tags: contact?.tags || [],
            additionalInvoiceRecipients:
              contact?.additionalInvoiceRecipients?.map(
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
      fetchContact();
    }
  }, [contactId, reset, setValue, t]);

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

ContactForm.propTypes = {
  fields: PropTypes.array.isRequired,
  contactId: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default ContactsAddEdit;
