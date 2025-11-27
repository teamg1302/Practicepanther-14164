/**
 * Firm Logo and Information page component.
 * @module feature-module/pages/settings/firm-logo-info
 *
 * Allows users to manage their firm information including:
 * - Account Owner information
 * - Legal Business Name and details
 * - Business address and contact information
 * - Business structure and practice area
 * - Business owner information
 *
 * @component
 */

import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import * as yup from "yup";
import Swal from "sweetalert2";
import { FormProvider } from "@/feature-module/components/rhf";
import Input from "@/feature-module/components/form-elements/input";
import Select from "@/feature-module/components/form-elements/select";
import DatePicker from "@/feature-module/components/form-elements/datepicker";

/**
 * Validation schema for firm information form.
 */
const firmInfoSchema = yup.object({
  accountOwner: yup.string().trim().optional(),
  legalBusinessName: yup.string().trim().optional(),
  country: yup.string().trim().optional(),
  countrySpecify: yup
    .string()
    .trim()
    .when("country", {
      is: "Other",
      then: (schema) => schema.required("Please specify your country."),
      otherwise: (schema) => schema.optional(),
    }),
  address1: yup.string().trim().optional(),
  address2: yup.string().trim().optional(),
  city: yup.string().trim().optional(),
  zipPostalCode: yup.string().trim().optional(),
  phoneNumber: yup.string().trim().optional(),
  firmEmailAddress: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Firm email address is required."),
  website: yup.string().trim().url("Enter a valid website URL.").optional(),
  taxId: yup.string().trim().optional(),
  primaryPracticeArea: yup
    .string()
    .trim()
    .required("Primary practice area is required."),
  numberOfAttorneys: yup.string().trim().optional(),
  businessStructure: yup.string().trim().optional(),
  formationDate: yup.date().nullable().optional(),
  primaryOwnerEmail: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Primary owner email is required."),
  ownerFirstName: yup.string().trim().required("First name is required."),
  ownerLastName: yup.string().trim().required("Last name is required."),
  ownerPhoneNumber: yup.string().trim().required("Phone number is required."),
  barNumber: yup.string().trim().optional(),
});

/**
 * Country options for the select dropdown.
 * @type {Array<{value: string, label: string}>}
 */
const countryOptions = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "IN", label: "India" },
  { value: "Other", label: "Other" },
];

/**
 * Account Owner options.
 * @type {Array<{value: string, label: string}>}
 */
const accountOwnerOptions = [
  { value: "man-singh", label: "Man Singh" },
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
];

/**
 * Primary Practice Area options.
 * @type {Array<{value: string, label: string}>}
 */
const primaryPracticeAreaOptions = [
  { value: "corporate", label: "Corporate" },
  { value: "criminal", label: "Criminal Law" },
  { value: "family", label: "Family Law" },
  { value: "real-estate", label: "Real Estate" },
  { value: "intellectual-property", label: "Intellectual Property" },
  { value: "employment", label: "Employment Law" },
  { value: "tax", label: "Tax Law" },
  { value: "immigration", label: "Immigration" },
  { value: "personal-injury", label: "Personal Injury" },
  { value: "other", label: "Other" },
];

/**
 * Number of Attorneys options.
 * @type {Array<{value: string, label: string}>}
 */
const numberOfAttorneysOptions = [
  { value: "1", label: "1" },
  { value: "2-5", label: "2-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-25", label: "11-25" },
  { value: "26-50", label: "26-50" },
  { value: "51-100", label: "51-100" },
  { value: "100+", label: "100+" },
];

/**
 * Business Structure options.
 * @type {Array<{value: string, label: string}>}
 */
const businessStructureOptions = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "professional-corporation", label: "Professional Corporation" },
  { value: "limited-partnership", label: "Limited Partnership" },
  { value: "other", label: "Other" },
];

const FirmLogoInfo = () => {
  /**
   * Handles form submission with validation and error handling.
   *
   * @param {Object} formData - Form data from React Hook Form
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    try {
      // Here you can add your API call
      // await updateFirmInfo(formData);

      Swal.fire({
        icon: "success",
        title: "Firm Information Saved",
        text: "Your firm information has been saved successfully.",
        showConfirmButton: true,
        timer: 2000,
      });

      console.log("Form Data:", formData);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to save firm information. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="settings-page-wrap">
      <FormProvider
        schema={firmInfoSchema}
        defaultValues={{
          accountOwner: "",
          legalBusinessName: "",
          country: "",
          countrySpecify: "",
          address1: "",
          address2: "",
          city: "",
          zipPostalCode: "",
          phoneNumber: "",
          firmEmailAddress: "",
          website: "",
          taxId: "",
          primaryPracticeArea: "",
          numberOfAttorneys: "",
          businessStructure: "",
          formationDate: null,
          primaryOwnerEmail: "",
          ownerFirstName: "",
          ownerLastName: "",
          ownerPhoneNumber: "",
          barNumber: "",
        }}
        onSubmit={onSubmit}
      >
        <div className="setting-title">
          <h4>FIRM INFORMATION</h4>
        </div>

        {/* Firm Logo Upload */}
        <div className="profile-pic-upload">
          <div className="profile-pic">
            <span>
              <PlusCircle className="plus-down-add" />
              Firm Logo
            </span>
          </div>
          <div className="new-employee-field">
            <div className="mb-0 d-flex gap-2">
              <div className="image-upload mb-0">
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload firm logo"
                />

                <div className="image-uploads">
                  <h4>Change Image</h4>
                </div>
              </div>
              <button type="button" className="btn btn-danger border-radius-5">
                Remove
              </button>
            </div>
            <span className="text-muted small">
              For better preview recommended size is 450px x 450px. Max size
              5MB.
            </span>
          </div>
        </div>

        {/* Account Owner Section */}
        <div className="card-title-head">
          <h6>ACCOUNT OWNER</h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Select
              name="accountOwner"
              label="Account Owner"
              options={accountOwnerOptions}
              placeholder="Select account owner"
            />
          </div>
        </div>

        {/* Business Information Section */}
        <div className="row">
          <div className="col-md-12">
            <Input
              name="legalBusinessName"
              label="Legal Business Name"
              type="text"
            />
          </div>
          <div className="col-md-12">
            <Select
              name="country"
              label="Country"
              options={countryOptions}
              placeholder="Select country"
            />
          </div>
          <CountrySpecifyField />
          <div className="col-md-12">
            <Input name="address1" label="Address 1" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="address2" label="Address 2" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="city" label="City" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="zipPostalCode" label="ZIP / POSTAL CODE" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="phoneNumber" label="Phone Number" type="tel" />
          </div>
          <div className="col-md-12">
            <Input
              name="firmEmailAddress"
              label="Firm Email Address"
              type="email"
              required
            />
          </div>
          <div className="col-md-12">
            <Input name="website" label="Website" type="url" />
          </div>
          <div className="col-md-12">
            <Input name="taxId" label="Tax ID / GST / LEDES ID" type="text" />
          </div>
        </div>

        {/* Business and Business Owner Info Section */}
        <div className="card-title-head">
          <h6>Business and Business Owner Info</h6>
          <p className="text-muted small mt-2">
            Please provide accurate information about the business and firm
            owner. This information will not appear on your invoice letterhead.
          </p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Select
              name="primaryPracticeArea"
              label="Primary Practice Area"
              options={primaryPracticeAreaOptions}
              placeholder="Select primary practice area"
              required
            />
          </div>
          <div className="col-md-12">
            <Select
              name="numberOfAttorneys"
              label="Number of Attorneys"
              options={numberOfAttorneysOptions}
              placeholder="Select the number of attorneys"
            />
          </div>
          <div className="col-md-12">
            <Select
              name="businessStructure"
              label="Business Structure"
              options={businessStructureOptions}
              placeholder="Select your business structure"
            />
          </div>
          <div className="col-md-12">
            <DatePicker
              name="formationDate"
              label="Formation Date"
              placeholder="Select formation date"
              showYearDropdown
              showMonthDropdown
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="col-md-12">
            <Input
              name="primaryOwnerEmail"
              label="Primary Owner Email"
              type="email"
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              name="ownerFirstName"
              label="First Name"
              type="text"
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              name="ownerLastName"
              label="Last Name"
              type="text"
              required
            />
          </div>
          <div className="col-md-12">
            <Input
              name="ownerPhoneNumber"
              label="Phone Number"
              type="tel"
              required
            />
          </div>
          <div className="col-md-12">
            <Input name="barNumber" label="Bar Number" type="text" />
          </div>
        </div>

        <FormSubmitButtons />
      </FormProvider>
    </div>
  );
};

/**
 * Country Specify Field component.
 * Conditionally renders based on country selection.
 * Shows when "Other" is selected.
 *
 * @returns {JSX.Element|null} Input component or null
 */
const CountrySpecifyField = () => {
  const { setValue } = useFormContext();
  const country = useWatch({ name: "country" });

  /**
   * Clears the countrySpecify value when country is changed from "Other".
   */
  React.useEffect(() => {
    if (country !== "Other") {
      setValue("countrySpecify", "");
    }
  }, [country, setValue]);

  if (country !== "Other") {
    return null;
  }

  return (
    <div className="col-md-12">
      <Input
        name="countrySpecify"
        label="Please specify your country"
        type="text"
        required
      />
    </div>
  );
};

/**
 * Form submit buttons component.
 * Uses form context to access submission state.
 *
 * @returns {JSX.Element} Submit and cancel buttons
 */
const FormSubmitButtons = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="text-end settings-bottom-btn">
      <button type="button" className="btn btn-cancel me-2">
        Cancel
      </button>
      <button
        type="submit"
        className="btn btn-submit"
        disabled={isSubmitting}
        aria-label={isSubmitting ? "Saving firm information" : "Save changes"}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default FirmLogoInfo;
