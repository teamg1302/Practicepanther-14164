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
import { useSelector, useDispatch } from "react-redux";
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
import { fetchTimezones, fetchJobTitles } from "@/core/redux/mastersReducer";
import { all_routes } from "@/Router/all_routes";

const PersonalSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const route = all_routes;
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef(null);

  const personalSettingsSchema = React.useMemo(
    () =>
      yup.object({
        profileImage: yup.string().trim().optional(),
        name: yup
          .string()
          .trim()
          .required(t("personalSettings.validation.firstNameRequired")),
        // lastName: yup
        //   .string()
        //   .trim()
        //   .required(t("personalSettings.validation.lastNameRequired")),
        // middleName: yup.string().trim().optional(),
        jobTitleId: yup.string().trim().optional(),
        mobile: yup.string().trim().optional(),
        email: yup
          .string()
          .trim()
          .email(t("personalSettings.validation.emailInvalid"))
          .required(t("personalSettings.validation.emailRequired")),
        timezoneId: yup.string().trim().optional(),
        home: yup.string().trim().optional(),
        office: yup.string().trim().optional(),
        hourlyRate: yup.string().trim().optional(),
        //  .typeError(t("personalSettings.validation.hourlyRateNumber"))
        // .positive(t("personalSettings.validation.hourlyRatePositive"))

        //.required(t("personalSettings.validation.hourlyRateRequired")),
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

      // Get the actual File object from form state using getValues
      // React Hook Form might serialize File objects in formData parameter
      const getValues = formRef.current?.getValues;

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        let value = formData[key];

        // For profileImage, try to get the actual File object from form state
        if (key === "profileImage" && getValues) {
          const fileValue = getValues("profileImage");
          if (fileValue instanceof File) {
            value = fileValue;
          }
        }

        // Skip null, undefined, or empty string values
        if (value === null || value === undefined || value === "") {
          return;
        }

        // Handle file uploads - single File object (append as binary)
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
          return;
        }

        // Convert boolean to string for FormData
        if (typeof value === "boolean") {
          formDataToSubmit.append(key, value.toString());
          return;
        }

        // Handle arrays and objects (convert to JSON string if needed)
        if (typeof value === "object" && !(value instanceof File)) {
          formDataToSubmit.append(key, JSON.stringify(value));
          return;
        }

        // Handle primitive values (strings, numbers, etc.)
        formDataToSubmit.append(key, value);
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
          name: "",
          // middleName: "",
          // lastName: "",
          jobTitleId: "",
          mobile: "",
          email: "",
          timezoneId: "",
          home: "",
          office: "",
          hourlyRate: "",
          roundTimeEntries: false,
          roundTimeEntryType: "",
          dailyAgendaEmail: false,
          profileImage: null,
        }}
        onSubmit={onSubmit}
      >
        <PersonalSettingsContent
          ref={formRef}
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

const PersonalSettingsContent = React.forwardRef(
  ({ userId, isLoading, setIsLoading }, ref) => {
    const { t } = useTranslation();
    const { reset, watch, getValues } = useFormContext();
    const dispatch = useDispatch();

    // Expose getValues to parent component via ref
    React.useImperativeHandle(ref, () => ({
      getValues,
    }));

    // Get timezones from Redux store
    const timezones = useSelector((state) => state.masters?.timezones || []);
    const timezonesLoading = useSelector(
      (state) => state.masters?.timezonesLoading || false
    );

    // Get profileImage from form values for preview
    const profileImage = watch("profileImage");

    const roundTimeEntryTypeOptionsTranslated = React.useMemo(
      () => [
        { label: t("personalSettings.roundOptions.up"), value: "up" },
        { label: t("personalSettings.roundOptions.down"), value: "down" },
      ],
      [t]
    );

    // Fetch timezones from API when store state is empty
    React.useEffect(() => {
      // Only fetch if timezones array is empty and not currently loading
      if (timezones.length === 0 && !timezonesLoading) {
        dispatch(fetchTimezones());
      }
    }, [dispatch, timezones.length, timezonesLoading]);

    const jobTitles = useSelector((state) => state.masters?.jobTitles || []);
    const jobTitlesLoading = useSelector(
      (state) => state.masters?.jobTitlesLoading || false
    );

    React.useEffect(() => {
      if (jobTitles.length === 0 && !jobTitlesLoading) {
        dispatch(fetchJobTitles());
      }
    }, [dispatch, jobTitles.length, jobTitlesLoading]);

    React.useEffect(() => {
      const fetchUserDetails = async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
          const userData = await getUserDetails(userId);

          // Map API response to form fields - ensure proper type conversion
          const formData = {
            profileImage: userData?.profileImage,
            name: userData?.name,
            // middleName: userData?.middleName || userData?.middle_name || "",
            // lastName: userData?.lastName || userData?.last_name || "",
            jobTitleId: userData?.jobTitleId?._id || "",
            mobile: userData?.mobile || userData?.phone || "",
            email: userData?.email || "",
            timezoneId: userData?.timezoneId?._id || "",
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
          name="profileImage"
          label={t("personalSettings.profilePhoto")}
          changeText={t("changeImage")}
          helpText={t("personalSettings.imageUploadHelp")}
          accept="image/*"
          previewImageUrl={profileImage}
        />
        <div className="row">
          <div className="col-md-12">
            <Input
              name="name"
              label={t("personalSettings.name")}
              type="text"
              required
            />
          </div>
          {/* <div className="col-md-4">
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
        </div> */}
          <div className="col-md-12">
            <Select
              name="jobTitleId"
              label={t("personalSettings.jobTitle")}
              options={jobTitles}
              placeholder={
                t("personalSettings.selectJobTitle") || "Select Job Title"
              }
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
              name="timezoneId"
              label={t("personalSettings.timezone")}
              options={timezones}
              placeholder={t("personalSettings.selectTimezone")}
              disabled={timezonesLoading}
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
  }
);

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

PersonalSettingsContent.displayName = "PersonalSettingsContent";

PersonalSettingsContent.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default PersonalSettings;
