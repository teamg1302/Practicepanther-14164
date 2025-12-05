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

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import Swal from "sweetalert2";
import EntityFormView from "@/feature-module/components/entity-form-view";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import { getFirmDetails, updateFirmDetails } from "@/core/services/firmService";
import { convertToFormData } from "@/core/utilities/formDataConverter";
import {
  fetchCountries,
  fetchCurrencies,
  fetchStatesByCountry,
  clearStates,
} from "@/core/redux/mastersReducer";

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
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef(null);

  /**
   * Validation schema for firm information form.
   */
  const firmInfoSchema = useMemo(
    () =>
      yup.object({
        file: yup.string().trim().optional(),
        accountOwner: yup.string().trim().optional(),
        name: yup
          .string()
          .trim()
          .required(t("firmLogoInfo.validation.nameRequired")),
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
          .url(t("firmLogoInfo.validation.websiteInvalid"))
          .optional(),
        taxId: yup.string().trim().optional(),
        primaryPracticeArea: yup.string().trim().optional(),
        numberOfAttorneys: yup.string().trim().optional(),
        businessStructure: yup.string().trim().optional(),
        formationDate: yup.date().nullable().optional(),
        primaryOwnerEmail: yup.string().trim().optional(),
        ownerFirstName: yup.string().trim().optional(),
        ownerLastName: yup.string().trim().optional(),
        ownerPhoneNumber: yup.string().trim().optional(),
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
      // Get userFirmId from user object
      const userFirmId = user?.firmId?._id;

      // Convert form data to FormData using utility function
      const getValues = formRef.current?.getValues;
      const formDataToSubmit = convertToFormData(formData, {
        getValues,
        fileFields: ["file"],
      });

      await updateFirmDetails(userFirmId, formDataToSubmit);

      Swal.fire({
        icon: "success",
        title: t("firmLogoInfo.messages.firmInfoSaved"),
        text: t("firmLogoInfo.messages.firmInfoSavedMessage"),
        showConfirmButton: true,
        timer: 2000,
      });
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
    <main className="settings-content-main">
      <div className="settings-page-wrap">
        <FirmLogoInfoContent
          ref={formRef}
          userFirmId={user?.firmId?._id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          schema={firmInfoSchema}
          onSubmit={onSubmit}
        />
      </div>
    </main>
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
 * @param {Object} props.schema - Yup validation schema
 * @param {Function} props.onSubmit - Form submission handler
 * @returns {JSX.Element} Form content
 */
const FirmLogoInfoContent = React.forwardRef(
  ({ userFirmId, isLoading, setIsLoading, schema, onSubmit }, ref) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

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

    // Fetch countries and currencies from API when store state is empty
    React.useEffect(() => {
      if (countries.length === 0 && !countriesLoading) {
        //  dispatch(fetchCountries());
      }
    }, [dispatch, countries.length, countriesLoading]);

    React.useEffect(() => {
      if (currencies.length === 0 && !currenciesLoading) {
        //  dispatch(fetchCurrencies());
      }
    }, [dispatch, currencies.length, currenciesLoading]);

    // Create fields array for EntityFormView
    const fields = useMemo(() => {
      return [
        {
          id: "firmLogo",
          name: "firmLogo",
          label: t("firmLogoInfo.firmLogo"),
          type: "userImage",
          col: 12,
          accept: "image/*",
          helpText: t("firmLogoInfo.imageUploadHelp"),
        },
        // Account Owner
        {
          id: "accountOwner",
          name: "accountOwner",
          label: t("firmLogoInfo.accountOwner"),
          type: "select",
          col: 12,
          options: accountOwnerOptions,
          placeholder: t("firmLogoInfo.selectAccountOwner"),
          disabled: true,
        },
        // Business Information
        {
          id: "name",
          name: "name",
          label: t("firmLogoInfo.name"),
          type: "text",
          col: 12,
          required: true,
        },
        {
          id: "countryId",
          name: "countryId",
          label: t("firmLogoInfo.country"),
          type: "select",
          col: 12,
          options: countries,
          placeholder: t("firmLogoInfo.selectCountry"),
          disabled: countriesLoading,
        },
        {
          id: "stateId",
          name: "stateId",
          label: t("firmLogoInfo.state"),
          type: "stateSelect",
          col: 12,
          options: states,
          placeholder: t("firmLogoInfo.selectState"),
          disabled: statesLoading,
        },
        {
          id: "currencyId",
          name: "currencyId",
          label: t("firmLogoInfo.currency"),
          type: "select",
          col: 12,
          options: currencies,
          placeholder: t("firmLogoInfo.selectCurrency"),
          disabled: currenciesLoading,
        },
        {
          id: "address1",
          name: "address1",
          label: t("firmLogoInfo.address1"),
          type: "text",
          col: 12,
        },
        {
          id: "address2",
          name: "address2",
          label: t("firmLogoInfo.address2"),
          type: "text",
          col: 12,
        },
        {
          id: "city",
          name: "city",
          label: t("firmLogoInfo.city"),
          type: "text",
          col: 12,
        },
        {
          id: "zipCode",
          name: "zipCode",
          label: t("firmLogoInfo.zipPostalCode"),
          type: "text",
          col: 12,
        },
        {
          id: "phone",
          name: "phone",
          label: t("firmLogoInfo.phoneNumber"),
          type: "text",
          col: 12,
        },
        {
          id: "email",
          name: "email",
          label: t("firmLogoInfo.firmEmailAddress"),
          type: "email",
          col: 12,
          required: true,
        },
        {
          id: "website",
          name: "website",
          label: t("firmLogoInfo.website"),
          type: "url",
          col: 12,
        },
        {
          id: "taxId",
          name: "taxId",
          label: t("firmLogoInfo.taxId"),
          type: "text",
          col: 12,
        },
        // Business and Owner Info
        {
          id: "primaryPracticeArea",
          name: "primaryPracticeArea",
          label: t("firmLogoInfo.primaryPracticeArea"),
          type: "select",
          col: 12,
          options: primaryPracticeAreaOptions,
          placeholder: t("firmLogoInfo.selectPrimaryPracticeArea"),
        },
        {
          id: "numberOfAttorneys",
          name: "numberOfAttorneys",
          label: t("firmLogoInfo.numberOfAttorneys"),
          type: "select",
          col: 12,
          options: numberOfAttorneysOptions,
          placeholder: t("firmLogoInfo.selectNumberOfAttorneys"),
        },
        {
          id: "businessStructure",
          name: "businessStructure",
          label: t("firmLogoInfo.businessStructure"),
          type: "select",
          col: 12,
          options: businessStructureOptions,
          placeholder: t("firmLogoInfo.selectBusinessStructure"),
        },
        {
          id: "formationDate",
          name: "formationDate",
          label: t("firmLogoInfo.formationDate"),
          type: "datepicker",
          col: 12,
          placeholder: t("firmLogoInfo.selectFormationDate"),
          showYearDropdown: true,
          showMonthDropdown: true,
          dateFormat: "dd/MM/yyyy",
        },
        {
          id: "primaryOwnerEmail",
          name: "primaryOwnerEmail",
          label: t("firmLogoInfo.primaryOwnerEmail"),
          type: "email",
          col: 12,
        },
        {
          id: "ownerFirstName",
          name: "ownerFirstName",
          label: t("firmLogoInfo.ownerFirstName"),
          type: "text",
          col: 6,
        },
        {
          id: "ownerLastName",
          name: "ownerLastName",
          label: t("firmLogoInfo.ownerLastName"),
          type: "text",
          col: 6,
        },
        {
          id: "ownerPhoneNumber",
          name: "ownerPhoneNumber",
          label: t("firmLogoInfo.ownerPhoneNumber"),
          type: "tel",
          col: 12,
        },
        {
          id: "barNumber",
          name: "barNumber",
          label: t("firmLogoInfo.barNumber"),
          type: "text",
          col: 12,
        },
      ];
    }, [
      t,
      countries,
      currencies,
      states,
      countriesLoading,
      currenciesLoading,
      statesLoading,
    ]);

    // Default values for the form
    const defaultValues = useMemo(
      () => ({
        accountOwner: "",
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
      }),
      []
    );

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
        <div className="setting-description mb-4">
          <span>
            Please ensure your firm details are updated and accurate. Logo,
            legal business name, address, phone number, and firm email address
            will appear on your invoice letterhead.
          </span>
        </div>
        <EntityFormView
          schema={schema}
          defaultValues={defaultValues}
          fields={fields}
          onSubmit={onSubmit}
        />
      </>
    );
  }
);

FirmLogoInfoContent.displayName = "FirmLogoInfoContent";

/**
 * Form Data Fetcher component.
 * Handles fetching firm details and populating the form.
 * Must be rendered inside FormProvider context.
 */
const FormDataFetcher = React.forwardRef(
  ({ userFirmId, setIsLoading }, ref) => {
    const { t } = useTranslation();
    const { reset, watch, getValues, setValue } = useFormContext();
    const dispatch = useDispatch();
    const logoValue = watch("file");
    const countryId = watch("countryId");

    // Expose getValues to parent component via ref
    React.useImperativeHandle(ref, () => ({
      getValues,
    }));

    // Fetch states when countryId changes
    React.useEffect(() => {
      if (countryId) {
        setValue("stateId", "");
        //  dispatch(fetchStatesByCountry({ countryId }));
      } else {
        //  dispatch(clearStates());
      }
    }, [dispatch, countryId, setValue]);

    // Fetch firm details on mount
    React.useEffect(() => {
      const fetchFirmDetails = async () => {
        if (!userFirmId) return;

        setIsLoading(true);
        try {
          const firmData = await getFirmDetails(userFirmId);

          // Map API response to form fields
          const firm = firmData?.data?.firm || firmData?.firm || firmData;

          const formData = {
            file: firm?.logo || null,
            accountOwner: firm?.accountOwner || "",
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
          };

          // Reset form with fetched data
          reset(formData, {
            keepDefaultValues: false,
          });

          // Fetch states if country is selected
          if (formData.countryId) {
            //  dispatch(fetchStatesByCountry({ countryId: formData.countryId }));
          }
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
    }, [userFirmId, reset, setIsLoading, t, dispatch]);

    return (
      <>
        {/* Firm Logo Upload */}
        <PhotoUpload
          name="file"
          label={t("firmLogoInfo.firmLogo")}
          changeText={t("changeImage")}
          helpText={t("firmLogoInfo.imageUploadHelp")}
          accept="image/*"
          previewImageUrl={
            typeof logoValue === "string" ? logoValue : undefined
          }
        />
      </>
    );
  }
);

FormDataFetcher.displayName = "FormDataFetcher";

FormDataFetcher.propTypes = {
  userFirmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setIsLoading: PropTypes.func.isRequired,
};

FirmLogoInfoContent.propTypes = {
  userFirmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FirmLogoInfo;
