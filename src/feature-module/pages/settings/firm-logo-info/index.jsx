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
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FormProvider } from "@/feature-module/components/rhf";
import Input from "@/feature-module/components/form-elements/input";
import Select from "@/feature-module/components/form-elements/select";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import { FormButton } from "@/feature-module/components/buttons";
import { getFirmDetails, updateFirmDetails } from "@/core/services/firmService";
import { convertToFormData } from "@/core/utilities/formDataConverter";
import {
  fetchCountries,
  fetchCurrencies,
  fetchStatesByCountry,
  clearStates,
} from "@/core/redux/mastersReducer";

import PageLayout from "@/feature-module/components/list-page-layout";
import { all_routes } from "@/Router/all_routes";
import { setAuthUser } from "@/core/redux/action";
/**
 * Account Owner options.
 * @type {Array<{value: string, label: string}>}
 */
// const accountOwnerOptions = [
//   { value: "man-singh", label: "Man Singh" },
//   { value: "john-doe", label: "John Doe" },
//   { value: "jane-smith", label: "Jane Smith" },
// ];

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const formRef = React.useRef(null);

  /**
   * Validation schema for firm information form.
   */
  const firmInfoSchema = React.useMemo(
    () =>
      yup.object({
        firmLogo: yup
          .mixed()
          .nullable()
          .transform((value) => {
            // Convert null/undefined to empty string for string validation
            if (value === null || value === undefined) {
              return "";
            }
            // If it's a File object, return as is
            if (value instanceof File) {
              return value;
            }
            // If it's a string (URL), return trimmed
            return typeof value === "string" ? value.trim() : value;
          })
          .test("is-string-or-file", (value) => {
            // Allow empty string, File objects, or valid string URLs
            return (
              value === "" || value instanceof File || typeof value === "string"
            );
          })
          .optional(),
        portalLogo: yup
          .mixed()
          .nullable()
          .transform((value) => {
            // Convert null/undefined to empty string for string validation
            if (value === null || value === undefined) {
              return "";
            }
            // If it's a File object, return as is
            if (value instanceof File) {
              return value;
            }
            // If it's a string (URL), return trimmed
            return typeof value === "string" ? value.trim() : value;
          })
          .test("is-string-or-file", (value) => {
            // Allow empty string, File objects, or valid string URLs
            return (
              value === "" || value instanceof File || typeof value === "string"
            );
          })
          .optional(),
        colorScheme: yup
          .object()
          .shape({
            headerColor: yup.string().trim().optional(),
          })
          .optional(),
        //  accountOwner: yup.string().trim().optional(),
        name: yup
          .string()
          .trim()
          .required(t("formElements.validation.required")),
        countryId: yup.string().trim().optional(),
        stateId: yup.string().trim().optional(),
        currencyId: yup.string().trim().optional(),
        address1: yup.string().trim().optional(),
        address2: yup.string().trim().optional(),
        city: yup.string().trim().optional(),
        zipCode: yup.string().trim().optional(),
        phone: yup.string().trim().optional(),
        email: yup
          .string()
          .trim()
          .email(t("firmLogoInfo.validation.emailInvalid"))
          .required(t("firmLogoInfo.validation.emailRequired")),
        website: yup
          .string()
          .trim()
          .test(
            "url",
            t("firmLogoInfo.validation.websiteInvalid"),
            (value) => !value || yup.string().url().isValidSync(value)
          )
          .optional(),
        taxId: yup.string().trim().optional(),
        primaryPracticeArea: yup.string().trim().optional(),
        //  .required(t("firmLogoInfo.validation.primaryPracticeAreaRequired")),
        numberOfAttorneys: yup.string().trim().optional(),
        businessStructure: yup.string().trim().optional(),
        formationDate: yup.date().nullable().optional(),
        primaryOwnerEmail: yup.string().trim().optional(),
        //  .email(t("firmLogoInfo.validation.primaryOwnerEmailInvalid"))
        //  .required(t("firmLogoInfo.validation.primaryOwnerEmailRequired")),
        ownerFirstName: yup.string().trim().optional(),
        //  .required(t("firmLogoInfo.validation.ownerFirstNameRequired")),
        ownerLastName: yup.string().trim().optional(),
        //   .required(t("firmLogoInfo.validation.ownerLastNameRequired")),
        ownerPhoneNumber: yup.string().trim().optional(),
        // .required(t("firmLogoInfo.validation.ownerPhoneNumberRequired")),
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
      // Get userFirmId from user object (could be firmId, userFirmId, or id)
      const userFirmId = user?.firmId?._id;

      // Validate userFirmId exists
      if (!userFirmId) {
        Swal.fire({
          icon: "error",
          title: t("firmLogoInfo.messages.saveFailed"),
          text: "User firm ID is missing. Please contact support.",
          showConfirmButton: true,
        });
        return;
      }

      // Convert form data to FormData using utility function
      const getValues = formRef.current?.getValues;

      // Clean formData: convert null values to empty strings for file fields
      const cleanedFormData = {
        ...formData,
        firmLogo: formData.firmLogo === null ? "" : formData.firmLogo,
        portalLogo: formData.portalLogo === null ? "" : formData.portalLogo,
      };

      const formDataToSubmit = convertToFormData(cleanedFormData, {
        getValues,
        fileFields: ["firmLogo", "portalLogo"],
      });

      // console.log("formDataToSubmit", formDataToSubmit);
      await updateFirmDetails(userFirmId, formDataToSubmit);

      Swal.fire({
        icon: "success",
        title: t("firmLogoInfo.messages.firmInfoSaved"),
        text: t("firmLogoInfo.messages.firmInfoSavedMessage"),
        showConfirmButton: true,
        timer: 2000,
      });

      // Trigger rerender of FirmLogoInfoContent to refetch firm details
      setRefreshTrigger((prev) => prev + 1);

      //  navigate(route.settings[0].children[3].path);
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
    <PageLayout
      breadcrumbs={[
        {
          label: "Settings",
          redirect: all_routes.settings[0].path,
        },
        {
          label: "Firm Logo & Info",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      isSettingsLayout={true}
      title={t("firmLogoInfo.title")}
      subtitle="Manage your firm logo and information"
      actions={{
        onPrevious: {
          text: "Back to Home",
          onClick: () => navigate(all_routes.base_path),
        },
      }}
    >
      <FormProvider
        schema={firmInfoSchema}
        mode="onSubmit"
        defaultValues={{
          firmLogo: "",
          // accountOwner: "",
          name: "",
          countryId: "",
          stateId: "",
          currencyId: "",
          address1: "",
          address2: "",
          city: "",
          zipCode: "",
          phone: "",
          email: "",
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
          portalLogo: "",
          colorScheme: null,
        }}
        onSubmit={onSubmit}
      >
        <FirmLogoInfoContent
          ref={formRef}
          userFirmId={user?.firmId?._id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          refreshTrigger={refreshTrigger}
        />
      </FormProvider>
    </PageLayout>
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
 * @param {number} props.refreshTrigger - Trigger value to force refetch of firm details
 * @returns {JSX.Element} Form content
 */
const FirmLogoInfoContent = React.forwardRef(
  ({ userFirmId, isLoading, setIsLoading, refreshTrigger }, ref) => {
    const auth = useSelector((state) => state.auth);
    const { t } = useTranslation();
    const { reset, watch, getValues, setValue } = useFormContext();
    const dispatch = useDispatch();
    const logoValue = watch("firmLogo");
    const portalLogoValue = watch("portalLogo");
    const countryId = watch("countryId");

    // Get countries, currencies, and states from Redux store
    const countries = useSelector((state) => state.masters?.countries || []);
    const countriesLoading = useSelector(
      (state) => state.masters?.countriesLoading || false
    );
    const currencies = useSelector((state) => state.masters?.currencies || []);
    const currenciesLoading = useSelector(
      (state) => state.masters?.currenciesLoading || false
    );
    const states = useSelector((state) => state.masters?.states || []);
    const statesLoading = useSelector(
      (state) => state.masters?.statesLoading || false
    );

    // Expose getValues to parent component via ref
    React.useImperativeHandle(ref, () => ({
      getValues,
    }));

    // Fetch countries and currencies from API when store state is empty
    React.useEffect(() => {
      if (countries.length === 0 && !countriesLoading) {
        dispatch(fetchCountries());
      }
    }, [dispatch, countries.length, countriesLoading]);

    // console.log("countries", countries);

    React.useEffect(() => {
      if (currencies.length === 0 && !currenciesLoading) {
        dispatch(fetchCurrencies());
      }
    }, [dispatch, currencies.length, currenciesLoading]);

    // Fetch states when countryId changes and clear stateId when country changes
    React.useEffect(() => {
      // Clear stateId when country changes
      setValue("stateId", "");

      if (countryId) {
        dispatch(fetchStatesByCountry({ countryId }));
      } else {
        // Clear states when no country is selected
        dispatch(clearStates());
      }
    }, [dispatch, countryId, setValue]);

    React.useEffect(() => {
      const fetchFirmDetails = async () => {
        if (!userFirmId) return;

        setIsLoading(true);
        try {
          const firmData = await getFirmDetails(userFirmId);

          // Map API response to form fields - ensure proper type conversion
          // Handle nested response structure if present (e.g., response.data.data.firm)
          const firm = firmData?.data?.firm || firmData?.firm || firmData;

          const formData = {
            // accountOwner: firm?.accountOwner || "",
            name: firm?.name || "",
            countryId: firm?.countryId?._id || "",
            stateId: firm?.stateId?._id || "",
            currencyId: firm?.currencyId?._id || "",
            address1: firm?.address1 || "",
            address2: firm?.address2 || "",
            city: firm?.city || "",
            zipCode: firm?.zipCode || "",
            phone: firm?.phone || firm?.phone_number || "",
            email: firm?.email || "",
            website: firm?.website || "",
            taxId: firm?.taxId || "",
            primaryPracticeArea: firm?.primaryPracticeArea || "",
            numberOfAttorneys: firm?.numberOfAttorneys || "",
            businessStructure: firm?.businessStructure || "",
            formationDate: firm?.formationDate
              ? new Date(firm.formationDate)
              : null,
            primaryOwnerEmail: firm?.primaryOwnerEmail || "",
            ownerFirstName: firm?.ownerFirstName || "",
            ownerLastName: firm?.ownerLastName || "",
            ownerPhoneNumber: firm?.ownerPhoneNumber || "",
            barNumber: firm?.barNumber || "",
            firmLogo: firm?.firmLogo || "",
            portalLogo: firm?.portalLogo || "",
            colorScheme: firm?.colorScheme,
          };

          dispatch(
            setAuthUser({
              ...auth?.user,
              firmId: {
                ...auth?.user?.firmId,
                colorScheme: formData?.colorScheme || {
                  headerColor: "#ffffff",
                },
                portalLogo: formData?.portalLogo || "",
              },
            })
          );

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
    }, [userFirmId, refreshTrigger]);

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
        {/* Firm Logo Upload */}
        <div className="card-title-head mb-3">
          <h4 className="border-bottom-0 mb-0 pb-0">
            {t("firmLogoInfo.title")}
          </h4>
          <p className="text-muted mt-2">
            Make sure your firm details are correct and up to date. Your firm
            logo, legal name, address, phone number, and firm email will appear
            on your invoice.
          </p>
        </div>
        <div className="row">
          <label htmlFor="firmLogo" className="form-label">
            {t("firmLogoInfo.firmLogo")}
          </label>
          <PhotoUpload
            name="firmLogo"
            label={t("firmLogoInfo.firmLogo")}
            changeText={t("changeImage")}
            helpText={t("firmLogoInfo.imageUploadHelp")}
            accept="image/*"
            previewImageUrl={
              typeof logoValue === "string" ? logoValue : undefined
            }
          />
        </div>

        {/* Account Owner Section */}
        {/* <div className="card-title-head">
          <h6>{t("firmLogoInfo.accountOwner")}</h6>
        </div> */}
        {/* <div className="row">
          <div className="col-md-12">
            <Select
              name="accountOwner"
              label={t("firmLogoInfo.accountOwner")}
              options={accountOwnerOptions}
              placeholder={t("firmLogoInfo.selectAccountOwner")}
              disabled
            />
          </div>
        </div> */}

        {/* Business Information Section */}
        <div className="row">
          <div className="col-md-12">
            <Input
              name="name"
              label={t("firmLogoInfo.name")}
              type="text"
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              name="email"
              label={t("firmLogoInfo.firmEmailAddress")}
              type="email"
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              id="phone1"
              name="phone"
              label={t("firmLogoInfo.phoneNumber")}
              type="text"
            />
          </div>

          <div className="col-md-6">
            <Select
              name="countryId"
              label={t("firmLogoInfo.country")}
              options={countries}
              placeholder={t("firmLogoInfo.selectCountry")}
            />
          </div>
          <div className="col-md-6">
            <Select
              name="stateId"
              label={t("firmLogoInfo.state")}
              options={states}
              placeholder={t("firmLogoInfo.selectState")}
              disabled={!countryId || statesLoading}
            />
          </div>
          <div className="col-md-6">
            <Input name="city" label={t("firmLogoInfo.city")} type="text" />
          </div>

          <div className="col-md-6">
            <Select
              name="currencyId"
              label={t("firmLogoInfo.currency")}
              options={currencies}
              placeholder={t("firmLogoInfo.selectCurrency")}
              disabled={currenciesLoading}
            />
          </div>
          <div className="col-md-12">
            <Input
              name="address1"
              label={t("firmLogoInfo.address1")}
              type="text"
            />
          </div>
          <div className="col-md-6">
            <Input
              name="address2"
              label={t("firmLogoInfo.address2")}
              type="text"
            />
          </div>
          <div className="col-md-6">
            <Input
              name="zipCode"
              label={t("firmLogoInfo.zipPostalCode")}
              type="text"
            />
          </div>

          <div className="col-md-6">
            <Input
              name="website"
              label={t("firmLogoInfo.website")}
              type="url"
            />
          </div>

          <div className="col-md-6">
            <Input name="taxId" label={t("firmLogoInfo.taxId")} type="text" />
          </div>
        </div>

        {/* Business and Business Owner Info Section */}
        <div className="card-title-head">
          <h6>Portal Logo & Colors</h6>
          <p className="text-muted small mt-2">
            Upload logos and customize color scheme for branding.
          </p>
        </div>
        <div className="row mt-2">
          <div className="col-md-12">
            <PhotoUpload
              name="portalLogo"
              className="portal-logo-upload"
              label={"Portal Logo"}
              changeText={t("changeImage")}
              helpText={
                "For better preview recommended size is 260px x 66px. Max size 1MB."
              }
              accept="image/*"
              previewImageUrl={
                typeof portalLogoValue === "string"
                  ? portalLogoValue
                  : undefined
              }
            />
          </div>
          <div className="col-md-6">
            <Input
              name="colorScheme.headerColor"
              label={"Header Color"}
              type="color"
            />
          </div>
        </div>

        {/* Business and Business Owner Info Section */}

        {/* <div className="card-title-head mb-2">
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
            />
          </div>
          <div className="col-md-6">
            <Input
              name="ownerFirstName"
              label={t("firmLogoInfo.ownerFirstName")}
              type="text"
            />
          </div>
          <div className="col-md-6">
            <Input
              name="ownerLastName"
              label={t("firmLogoInfo.ownerLastName")}
              type="text"
            />
          </div>
          <div className="col-md-12">
            <Input
              name="ownerPhoneNumber"
              label={t("firmLogoInfo.ownerPhoneNumber")}
              type="tel"
            />
          </div>
          <div className="col-md-12">
            <Input
              name="barNumber"
              label={t("firmLogoInfo.barNumber")}
              type="text"
            />
          </div>
        </div> */}

        <FormSubmitButtons />
      </>
    );
  }
);

FirmLogoInfoContent.displayName = "FirmLogoInfoContent";

/**
 * Form submit buttons component.
 * Uses form context to access submission state.
 *
 * @returns {JSX.Element} Submit and cancel buttons
 */
const FormSubmitButtons = () => {
  const {
    formState: { isSubmitting, errors },
    reset,
  } = useFormContext();

  // Log validation errors for debugging
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  return (
    <div className="settings-bottom-btn d-flex flex-row gap-2 align-items-center justify-content-end">
      <FormButton type="submit" isSubmitting={isSubmitting} />
      <FormButton
        type="reset"
        isSubmitting={isSubmitting}
        onClick={() => reset()}
      />
      {/* <FormButton type="cancel" isSubmitting={isSubmitting} /> */}
    </div>
  );
};

FirmLogoInfoContent.propTypes = {
  userFirmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number,
};

export default FirmLogoInfo;
