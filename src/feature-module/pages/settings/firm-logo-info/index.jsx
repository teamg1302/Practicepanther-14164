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

import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import Swal from "sweetalert2";
import { FormProvider } from "@/feature-module/components/rhf";
import Input from "@/feature-module/components/form-elements/input";
import Select from "@/feature-module/components/form-elements/select";
import DatePicker from "@/feature-module/components/form-elements/datepicker";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import { FormButton } from "@/feature-module/components/buttons";
import { getFirmDetails, updateFirmDetails } from "@/core/services/firmService";
import { all_routes } from "@/Router/all_routes";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const route = all_routes;
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * Validation schema for firm information form.
   */
  const firmInfoSchema = React.useMemo(
    () =>
      yup.object({
        accountOwner: yup.string().trim().optional(),
        legalBusinessName: yup.string().trim().optional(),
        country: yup.string().trim().optional(),
        countrySpecify: yup
          .string()
          .trim()
          .when("country", {
            is: "Other",
            then: (schema) =>
              schema.required(
                t("firmLogoInfo.validation.countrySpecifyRequired")
              ),
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
          .email(t("firmLogoInfo.validation.firmEmailInvalid"))
          .required(t("firmLogoInfo.validation.firmEmailRequired")),
        website: yup
          .string()
          .trim()
          .url(t("firmLogoInfo.validation.websiteInvalid"))
          .optional(),
        taxId: yup.string().trim().optional(),
        primaryPracticeArea: yup
          .string()
          .trim()
          .required(t("firmLogoInfo.validation.primaryPracticeAreaRequired")),
        numberOfAttorneys: yup.string().trim().optional(),
        businessStructure: yup.string().trim().optional(),
        formationDate: yup.date().nullable().optional(),
        primaryOwnerEmail: yup
          .string()
          .trim()
          .email(t("firmLogoInfo.validation.primaryOwnerEmailInvalid"))
          .required(t("firmLogoInfo.validation.primaryOwnerEmailRequired")),
        ownerFirstName: yup
          .string()
          .trim()
          .required(t("firmLogoInfo.validation.ownerFirstNameRequired")),
        ownerLastName: yup
          .string()
          .trim()
          .required(t("firmLogoInfo.validation.ownerLastNameRequired")),
        ownerPhoneNumber: yup
          .string()
          .trim()
          .required(t("firmLogoInfo.validation.ownerPhoneNumberRequired")),
        barNumber: yup.string().trim().optional(),
      }),
    [t]
  );

  /**
   * Handles form submission with validation and error handling.
   *
   * @param {Object} formData - Form data from React Hook Form
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    try {
      // Create FormData object for file upload
      const formDataToSubmit = new FormData();

      // Get userFirmId from user object (could be firmId, userFirmId, or id)
      const userFirmId = user?.firmId || user?.userFirmId || user?.id;

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        // Handle file uploads
        if (key === "firmLogo" && value && value[0] instanceof File) {
          formDataToSubmit.append(key, value[0]);
        }
        // Handle date fields
        else if (key === "formationDate" && value) {
          if (value instanceof Date) {
            formDataToSubmit.append(key, value.toISOString());
          } else if (typeof value === "string") {
            formDataToSubmit.append(key, value);
          }
        }
        // Handle other fields - skip empty values
        else if (value !== null && value !== undefined && value !== "") {
          // Convert boolean to string for FormData
          if (typeof value === "boolean") {
            formDataToSubmit.append(key, value.toString());
          }
          // Handle arrays and objects (convert to JSON string if needed)
          else if (
            typeof value === "object" &&
            !(value instanceof File) &&
            !(value instanceof Date)
          ) {
            formDataToSubmit.append(key, JSON.stringify(value));
          }
          // Handle primitive values
          else {
            formDataToSubmit.append(key, value);
          }
        }
      });

      await updateFirmDetails(userFirmId, formDataToSubmit);

      Swal.fire({
        icon: "success",
        title: t("firmLogoInfo.messages.firmInfoSaved"),
        text: t("firmLogoInfo.messages.firmInfoSavedMessage"),
        showConfirmButton: true,
        timer: 2000,
      });

      navigate(route.settings[0].path);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        t("firmLogoInfo.messages.saveFailedMessage");
      Swal.fire({
        icon: "error",
        title: t("firmLogoInfo.messages.saveFailed"),
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
          firmLogo: null,
        }}
        onSubmit={onSubmit}
      >
        <FirmLogoInfoContent
          userFirmId={user?.firmId || user?.userFirmId || user?.id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </FormProvider>
    </div>
  );
};

/**
 * Firm Logo Info Content component.
 * Handles fetching firm details and populating the form.
 *
 * @param {Object} props
 * @param {string|number} props.userFirmId - User Firm ID to fetch details for
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.setIsLoading - Function to set loading state
 * @returns {JSX.Element} Form content
 */
const FirmLogoInfoContent = ({ userFirmId, isLoading, setIsLoading }) => {
  const { t } = useTranslation();
  const { reset, watch } = useFormContext();
  const firmLogoValue = watch("firmLogo");

  React.useEffect(() => {
    const fetchFirmDetails = async () => {
      if (!userFirmId) return;

      setIsLoading(true);
      try {
        const firmData = await getFirmDetails(userFirmId);

        console.log("firmData", firmData);

        // Map API response to form fields - ensure proper type conversion
        // Handle nested response structure if present (e.g., response.data.data.firm)
        const firm = firmData?.data?.firm || firmData?.firm || firmData;

        const formData = {
          accountOwner: firm?.accountOwner || "",
          legalBusinessName:
            firm?.legalBusinessName || firm?.legal_business_name || "",
          country: firm?.country || "",
          countrySpecify: firm?.countrySpecify || firm?.country_specify || "",
          address1: firm?.address1 || firm?.address_1 || "",
          address2: firm?.address2 || firm?.address_2 || "",
          city: firm?.city || "",
          zipPostalCode: firm?.zipPostalCode || firm?.zip_postal_code || "",
          phoneNumber: firm?.phoneNumber || firm?.phone_number || "",
          firmEmailAddress:
            firm?.firmEmailAddress || firm?.firm_email_address || "",
          website: firm?.website || "",
          taxId: firm?.taxId || firm?.tax_id || "",
          primaryPracticeArea:
            firm?.primaryPracticeArea || firm?.primary_practice_area || "",
          numberOfAttorneys:
            firm?.numberOfAttorneys || firm?.number_of_attorneys || "",
          businessStructure:
            firm?.businessStructure || firm?.business_structure || "",
          formationDate: firm?.formationDate
            ? new Date(firm.formationDate)
            : firm?.formation_date
            ? new Date(firm.formation_date)
            : null,
          primaryOwnerEmail:
            firm?.primaryOwnerEmail || firm?.primary_owner_email || "",
          ownerFirstName: firm?.ownerFirstName || firm?.owner_first_name || "",
          ownerLastName: firm?.ownerLastName || firm?.owner_last_name || "",
          ownerPhoneNumber:
            firm?.ownerPhoneNumber || firm?.owner_phone_number || "",
          barNumber: firm?.barNumber || firm?.bar_number || "",
          firmLogo: firm?.firmLogo || firm?.firm_logo || null,
        };

        // Reset form with fetched data - this will populate all form fields
        reset(formData, {
          keepDefaultValues: false,
        });
      } catch (error) {
        const errorMessage =
          error?.message || error?.error || "Failed to load firm details.";
        Swal.fire({
          icon: "error",
          title: t("firmLogoInfo.messages.loadFailed"),
          text: errorMessage,
          showConfirmButton: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirmDetails();
  }, [userFirmId, reset, setIsLoading, t]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="setting-title">
        <h4>{t("firmLogoInfo.title")}</h4>
      </div>

      {/* Firm Logo Upload */}
      <PhotoUpload
        name="firmLogo"
        label={t("firmLogoInfo.firmLogo")}
        changeText={t("changeImage")}
        helpText={t("firmLogoInfo.imageUploadHelp")}
        accept="image/*"
        previewImageUrl={
          typeof firmLogoValue === "string" ? firmLogoValue : undefined
        }
      />

      {/* Account Owner Section */}
      <div className="card-title-head">
        <h6>{t("firmLogoInfo.accountOwner")}</h6>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Select
            name="accountOwner"
            label={t("firmLogoInfo.accountOwner")}
            options={accountOwnerOptions}
            placeholder={t("firmLogoInfo.selectAccountOwner")}
          />
        </div>
      </div>

      {/* Business Information Section */}
      <div className="row">
        <div className="col-md-12">
          <Input
            name="legalBusinessName"
            label={t("firmLogoInfo.legalBusinessName")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Select
            name="country"
            label={t("firmLogoInfo.country")}
            options={countryOptions}
            placeholder={t("firmLogoInfo.selectCountry")}
          />
        </div>
        <CountrySpecifyField />
        <div className="col-md-12">
          <Input
            name="address1"
            label={t("firmLogoInfo.address1")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="address2"
            label={t("firmLogoInfo.address2")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Input name="city" label={t("firmLogoInfo.city")} type="text" />
        </div>
        <div className="col-md-12">
          <Input
            name="zipPostalCode"
            label={t("firmLogoInfo.zipPostalCode")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="phoneNumber"
            label={t("firmLogoInfo.phoneNumber")}
            type="tel"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="firmEmailAddress"
            label={t("firmLogoInfo.firmEmailAddress")}
            type="email"
            required
          />
        </div>
        <div className="col-md-12">
          <Input name="website" label={t("firmLogoInfo.website")} type="url" />
        </div>
        <div className="col-md-12">
          <Input name="taxId" label={t("firmLogoInfo.taxId")} type="text" />
        </div>
      </div>

      {/* Business and Business Owner Info Section */}
      <div className="card-title-head">
        <h6>{t("firmLogoInfo.businessAndOwnerInfo")}</h6>
        <p className="text-muted small mt-2">
          {t("firmLogoInfo.businessInfoHelp")}
        </p>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Select
            name="primaryPracticeArea"
            label={t("firmLogoInfo.primaryPracticeArea")}
            options={primaryPracticeAreaOptions}
            placeholder={t("firmLogoInfo.selectPrimaryPracticeArea")}
            required
          />
        </div>
        <div className="col-md-12">
          <Select
            name="numberOfAttorneys"
            label={t("firmLogoInfo.numberOfAttorneys")}
            options={numberOfAttorneysOptions}
            placeholder={t("firmLogoInfo.selectNumberOfAttorneys")}
          />
        </div>
        <div className="col-md-12">
          <Select
            name="businessStructure"
            label={t("firmLogoInfo.businessStructure")}
            options={businessStructureOptions}
            placeholder={t("firmLogoInfo.selectBusinessStructure")}
          />
        </div>
        <div className="col-md-12">
          <DatePicker
            name="formationDate"
            label={t("firmLogoInfo.formationDate")}
            placeholder={t("firmLogoInfo.selectFormationDate")}
            showYearDropdown
            showMonthDropdown
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="primaryOwnerEmail"
            label={t("firmLogoInfo.primaryOwnerEmail")}
            type="email"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            name="ownerFirstName"
            label={t("firmLogoInfo.ownerFirstName")}
            type="text"
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            name="ownerLastName"
            label={t("firmLogoInfo.ownerLastName")}
            type="text"
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            name="ownerPhoneNumber"
            label={t("firmLogoInfo.ownerPhoneNumber")}
            type="tel"
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            name="barNumber"
            label={t("firmLogoInfo.barNumber")}
            type="text"
          />
        </div>
      </div>

      <FormSubmitButtons />
    </>
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
  const { t } = useTranslation();
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
        label={t("firmLogoInfo.specifyCountry")}
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
    <div className="settings-bottom-btn d-flex flex-row gap-2 align-items-center justify-content-end">
      <FormButton type="submit" isSubmitting={isSubmitting} />
      <FormButton type="cancel" isSubmitting={isSubmitting} />
    </div>
  );
};

FirmLogoInfoContent.propTypes = {
  userFirmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default FirmLogoInfo;
