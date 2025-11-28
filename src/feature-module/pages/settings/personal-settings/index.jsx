/**
 * Personal Settings page component.
 * @module feature-module/pages/settings/personal-settings
 *
 * Allows users to manage their personal profile settings including:
 * - Profile information (name, job title, contact details)
 * - Contact information (home, office addresses)
 * - Time entry settings (hourly rate, rounding)
 * - Notification preferences
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
import Switch from "@/feature-module/components/form-elements/switch";
import Select from "@/feature-module/components/form-elements/select";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import { FormButton } from "@/feature-module/components/buttons";
import { getUserDetails, updateUserDetails } from "@/core/services/userService";
import { all_routes } from "@/Router/all_routes";

/**
 * Timezone options for the select dropdown.
 * @type {Array<{value: string, label: string}>}
 */

const timezoneOptions = [
  { label: "(UTC−12:00) International Date Line West", value: "UTC−12:00" },
  { label: "(UTC−11:00) Coordinated Universal Time−11", value: "UTC−11:00" },
  { label: "(UTC−10:00) Hawaii", value: "UTC−10:00" },
  { label: "(UTC−09:00) Alaska", value: "UTC−09:00" },
  { label: "(UTC−08:00) Pacific Time (US & Canada)", value: "UTC-08:00" },
  { label: "(UTC−07:00) Arizona", value: "UTC−07:00" },
  { label: "(UTC−07:00) Mountain Time (US & Canada)", value: "UTC−07:00-MT" },
  { label: "(UTC−06:00) Central Time (US & Canada)", value: "UTC−06:00" },
  { label: "(UTC−05:00) Eastern Time (US & Canada)", value: "UTC−05:00" },
  { label: "(UTC−04:00) Atlantic Time (Canada)", value: "UTC−04:00" },
  { label: "(UTC−03:00) Brasilia", value: "UTC−03:00" },
  { label: "(UTC−02:00) Mid-Atlantic", value: "UTC−02:00" },
  { label: "(UTC−01:00) Azores", value: "UTC−01:00" },
  { label: "(UTC+00:00) London, Dublin, Lisbon", value: "UTC+00:00" },
  { label: "(UTC+01:00) Amsterdam, Berlin, Rome, Paris", value: "UTC+01:00" },
  { label: "(UTC+02:00) Athens, Jerusalem, Cairo", value: "UTC+02:00" },
  { label: "(UTC+03:00) Moscow, Nairobi, Baghdad", value: "UTC+03:00" },
  { label: "(UTC+03:30) Tehran", value: "UTC+03:30" },
  { label: "(UTC+04:00) Abu Dhabi, Baku, Tbilisi", value: "UTC+04:00" },
  { label: "(UTC+04:30) Kabul", value: "UTC+04:30" },
  { label: "(UTC+05:00) Karachi, Tashkent", value: "UTC+05:00" },
  {
    label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    value: "UTC+05:30",
  },
  { label: "(UTC+05:30) Sri Jayawardenepura", value: "UTC+05:30-SJ" },
  { label: "(UTC+05:45) Kathmandu", value: "UTC+05:45" },
  { label: "(UTC+06:00) Dhaka", value: "UTC+06:00" },
  { label: "(UTC+06:00) Omsk", value: "UTC+06:00-OMSK" },
  { label: "(UTC+06:30) Yangon (Rangoon)", value: "UTC+06:30" },
  { label: "(UTC+07:00) Bangkok, Hanoi, Jakarta", value: "UTC+07:00" },
  { label: "(UTC+08:00) Beijing, Singapore, Hong Kong", value: "UTC+08:00" },
  { label: "(UTC+09:00) Tokyo, Seoul, Osaka", value: "UTC+09:00" },
  { label: "(UTC+09:30) Adelaide", value: "UTC+09:30" },
  { label: "(UTC+10:00) Brisbane", value: "UTC+10:00" },
  { label: "(UTC+11:00) Solomon Islands, New Caledonia", value: "UTC+11:00" },
  { label: "(UTC+12:00) Fiji, Marshall Islands", value: "UTC+12:00" },
  { label: "(UTC+13:00) Samoa, Tonga", value: "UTC+13:00" },
];

const PersonalSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const route = all_routes;
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);

  const personalSettingsSchema = React.useMemo(
    () =>
      yup.object({
        firstName: yup
          .string()
          .trim()
          .required(t("personalSettings.validation.firstNameRequired")),
        lastName: yup
          .string()
          .trim()
          .required(t("personalSettings.validation.lastNameRequired")),
        middleName: yup.string().trim().optional(),
        jobTitle: yup.string().trim().optional(),
        mobile: yup.string().trim().optional(),
        email: yup
          .string()
          .trim()
          .email(t("personalSettings.validation.emailInvalid"))
          .required(t("personalSettings.validation.emailRequired")),
        timezone: yup.string().trim().optional(),
        home: yup.string().trim().optional(),
        office: yup.string().trim().optional(),
        hourlyRate: yup
          .number()
          .typeError(t("personalSettings.validation.hourlyRateNumber"))
          .positive(t("personalSettings.validation.hourlyRatePositive"))
          .required(t("personalSettings.validation.hourlyRateRequired")),
        roundTimeEntries: yup.boolean().optional(),
        roundTimeEntryType: yup
          .string()
          .trim()
          .when("roundTimeEntries", {
            is: true,
            then: (schema) => schema.optional(),
            otherwise: (schema) => schema.optional(),
          }),
        dailyAgendaEmail: yup.boolean().optional(),
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

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        // Handle file uploads
        if (key === "profilePhoto" && value && value[0] instanceof File) {
          formDataToSubmit.append(key, value[0]);
        }
        // Handle other fields - skip empty values
        else if (value !== null && value !== undefined && value !== "") {
          // Convert boolean to string for FormData
          if (typeof value === "boolean") {
            formDataToSubmit.append(key, value.toString());
          }
          // Handle arrays and objects (convert to JSON string if needed)
          else if (typeof value === "object" && !(value instanceof File)) {
            formDataToSubmit.append(key, JSON.stringify(value));
          }
          // Handle primitive values
          else {
            formDataToSubmit.append(key, value);
          }
        }
      });

      await updateUserDetails(user?.id, formDataToSubmit);

      Swal.fire({
        icon: "success",
        title: t("personalSettings.messages.settingsSaved"),
        text: t("personalSettings.messages.settingsSavedMessage"),
        showConfirmButton: true,
        timer: 2000,
      });

      navigate(route.settings[0].path);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        t("personalSettings.messages.saveFailedMessage");
      Swal.fire({
        icon: "error",
        title: t("personalSettings.messages.saveFailed"),
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="settings-page-wrap">
      <FormProvider
        schema={personalSettingsSchema}
        defaultValues={{
          firstName: "",
          middleName: "",
          lastName: "",
          jobTitle: "",
          mobile: "",
          email: "",
          timezone: "",
          home: "",
          office: "",
          hourlyRate: "",
          roundTimeEntries: false,
          roundTimeEntryType: "",
          dailyAgendaEmail: false,
          profilePhoto: null,
        }}
        onSubmit={onSubmit}
      >
        <PersonalSettingsContent
          userId={user?.id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </FormProvider>
    </div>
  );
};

/**
 * Personal Settings Content component.
 * Handles fetching user details and populating the form.
 *
 * @param {Object} props
 * @param {string|number} props.userId - User ID to fetch details for
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.setIsLoading - Function to set loading state
 * @returns {JSX.Element} Form content
 */

const PersonalSettingsContent = ({ userId, isLoading, setIsLoading }) => {
  const { t } = useTranslation();
  const { reset } = useFormContext();

  const roundTimeEntryTypeOptionsTranslated = React.useMemo(
    () => [
      { label: t("personalSettings.roundOptions.up"), value: "up" },
      { label: t("personalSettings.roundOptions.down"), value: "down" },
    ],
    [t]
  );

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const userData = await getUserDetails(userId);

        console.log("userData", userData);

        // Map API response to form fields - ensure proper type conversion
        const formData = {
          firstName: userData?.firstName || userData?.first_name || "",
          middleName: userData?.middleName || userData?.middle_name || "",
          lastName: userData?.lastName || userData?.last_name || "",
          jobTitle: userData?.jobTitle || userData?.job_title || "",
          mobile: userData?.mobile || userData?.phone || "",
          email: userData?.email || "",
          timezone: userData?.timezone || "",
          home: userData?.home || userData?.homeAddress || "",
          office: userData?.office || userData?.officeAddress || "",
          hourlyRate: userData?.hourlyRate || userData?.hourly_rate || "",
          roundTimeEntries: Boolean(
            userData?.roundTimeEntries !== undefined
              ? userData?.roundTimeEntries
              : userData?.round_time_entries !== undefined
              ? userData?.round_time_entries
              : false
          ),
          roundTimeEntryType:
            userData?.roundTimeEntryType ||
            userData?.round_time_entry_type ||
            "",
          dailyAgendaEmail: Boolean(
            userData?.dailyAgendaEmail !== undefined
              ? userData?.dailyAgendaEmail
              : userData?.daily_agenda_email !== undefined
              ? userData?.daily_agenda_email
              : false
          ),
        };

        // console.log("formData", formData);

        // Reset form with fetched data - this will populate all form fields
        reset(formData, {
          keepDefaultValues: false,
        });
      } catch (error) {
        const errorMessage =
          error?.message || error?.error || "Failed to load user details.";
        Swal.fire({
          icon: "error",
          title: t("personalSettings.messages.loadFailed"),
          text: errorMessage,
          showConfirmButton: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, reset, setIsLoading, t]);

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
        <h4>{t("personalSettings.title")}</h4>
      </div>
      <PhotoUpload
        name="profilePhoto"
        label={t("personalSettings.profilePhoto")}
        changeText={t("changeImage")}
        helpText={t("personalSettings.imageUploadHelp")}
        accept="image/*"
      />
      <div className="row">
        <div className="col-md-4">
          <Input
            name="firstName"
            label={t("personalSettings.firstName")}
            type="text"
            required
          />
        </div>
        <div className="col-md-4">
          <Input
            name="middleName"
            label={t("personalSettings.middleName")}
            type="text"
          />
        </div>
        <div className="col-md-4">
          <Input
            name="lastName"
            label={t("personalSettings.lastName")}
            type="text"
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            name="jobTitle"
            label={t("personalSettings.jobTitle")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="mobile"
            label={t("personalSettings.mobile")}
            type="text"
          />
        </div>
        <div className="col-md-12">
          <Input
            name="email"
            label={t("personalSettings.email")}
            type="email"
            required
            helpText={t("personalSettings.emailHelpText")}
          />
        </div>
        <div className="col-md-12">
          <Select
            name="timezone"
            label={t("personalSettings.timezone")}
            options={timezoneOptions}
            placeholder={t("personalSettings.selectTimezone")}
          />
        </div>
      </div>
      <div className="card-title-head">
        <h6>
          <span>
            <i data-feather="map-pin" className="feather-chevron-up" />
          </span>
          {t("personalSettings.contactInformation")}
        </h6>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Input name="home" label={t("personalSettings.home")} type="text" />
        </div>
        <div className="col-md-12">
          <Input
            name="office"
            label={t("personalSettings.office")}
            type="text"
          />
        </div>
      </div>

      <div className="card-title-head">
        <h6>
          <span>
            <i data-feather="map-pin" className="feather-chevron-up" />
          </span>
          {t("personalSettings.timeEntries")}
        </h6>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Input
            name="hourlyRate"
            label={t("personalSettings.hourlyRate")}
            type="number"
            required
          />
        </div>
        <div className="col-md-4">
          <Switch
            name="roundTimeEntries"
            label={t("personalSettings.roundTimeEntries")}
          />
        </div>

        <RoundTimeEntryTypeSelect
          options={roundTimeEntryTypeOptionsTranslated}
        />
      </div>

      <div className="card-title-head">
        <h6>
          <span>
            <i data-feather="map-pin" className="feather-chevron-up" />
          </span>
          {t("personalSettings.notificationEmails")}
        </h6>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Switch
            name="dailyAgendaEmail"
            label={t("personalSettings.dailyAgendaEmail")}
          />
        </div>
      </div>
      <FormSubmitButtons />
    </>
  );
};

/**
 * Round Time Entry Type Select component.
 * Conditionally renders based on roundTimeEntries switch value.
 *
 * @param {Object} props
 * @param {Array} props.options - List of select options.
 * @returns {JSX.Element|null} Select component or null
 */
const RoundTimeEntryTypeSelect = ({ options }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const roundTimeEntries = useWatch({ name: "roundTimeEntries" });

  /**
   * Clears the roundTimeEntryType value when switch is turned off.
   */
  React.useEffect(() => {
    if (!roundTimeEntries) {
      setValue("roundTimeEntryType", "");
    }
  }, [roundTimeEntries, setValue]);

  if (!roundTimeEntries) {
    return null;
  }

  return (
    <>
      <div className="col-md-4">
        <Select
          name="roundTimeEntryType"
          label={t("personalSettings.roundTimeEntryType")}
          options={options}
          placeholder={t("personalSettings.selectRoundingType")}
          helpText={t("personalSettings.toTheNearest")}
        />
      </div>
      <div className="col-md-4">
        <Input
          name="fractionOfTheHour"
          label={t("personalSettings.fractionOfTheHour")}
          type="number"
          helpText={t("personalSettings.fractionOfTheHour")}
        />
      </div>
    </>
  );
};

RoundTimeEntryTypeSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
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

PersonalSettingsContent.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default PersonalSettings;
