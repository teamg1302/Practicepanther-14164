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
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import * as yup from "yup";
import Swal from "sweetalert2";
import { FormProvider } from "@/feature-module/components/rhf";
import Input from "@/feature-module/components/form-elements/input";
import Switch from "@/feature-module/components/form-elements/switch";
import Select from "@/feature-module/components/form-elements/select";
import { PhotoUpload } from "@/feature-module/components/form-elements/file-upload";
import { FormButton } from "@/feature-module/components/buttons";
import {
  getUserDetails,
  updateUserDetails,
  createUser,
} from "@/core/services/userService";
import { getRoles } from "@/core/services/roleService";
import { fetchTimezones, fetchJobTitles } from "@/core/redux/mastersReducer";
import { convertToFormData } from "@/core/utilities/formDataConverter";
import { all_routes } from "@/Router/all_routes";

const PersonalSettings = () => {
  const { userId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef(null);

  // Determine if we're in create mode (add user) or edit mode
  const isCreateMode = React.useMemo(() => {
    return location.pathname === all_routes.addUser;
  }, [location.pathname, userId]);

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
        password: isCreateMode
          ? yup
              .string()
              .trim()
              .required(
                t("personalSettings.validation.passwordRequired") ||
                  "Password is required"
              )
              .min(
                6,
                t("personalSettings.validation.passwordMinLength") ||
                  "Password must be at least 6 characters"
              )
          : yup
              .string()
              .trim()
              .optional()
              .min(
                6,
                t("personalSettings.validation.passwordMinLength") ||
                  "Password must be at least 6 characters"
              ),
        timezoneId: yup.string().trim().optional(),
        roleId: yup.string().trim().optional(),
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
    [t, isCreateMode]
  );

  /**
   * Handles form submission with validation and error handling.
   *
   * @param {Object} formData - Form data from React Hook Form
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    try {
      // For edit mode, remove password from formData if it's empty (not changed)
      let dataToSubmit = { ...formData };
      if (
        !isCreateMode &&
        (!formData.password || formData.password.trim() === "")
      ) {
        delete dataToSubmit.password;
      }

      // Convert form data to FormData using utility function
      const getValues = formRef.current?.getValues;
      const formDataToSubmit = convertToFormData(dataToSubmit, {
        getValues,
        fileFields: ["profileImage"],
      });

      if (isCreateMode) {
        // Create new user
        await createUser(formDataToSubmit);
        Swal.fire({
          icon: "success",
          title: t("personalSettings.messages.userCreated") || "User Created",
          text:
            t("personalSettings.messages.userCreatedMessage") ||
            "User has been created successfully.",
          showConfirmButton: true,
          timer: 2000,
        });
      } else {
        // Update existing user
        const targetUserId = userId || user?.id;
        await updateUserDetails(targetUserId, formDataToSubmit);
        Swal.fire({
          icon: "success",
          title: t("personalSettings.messages.settingsSaved"),
          text: t("personalSettings.messages.settingsSavedMessage"),
          showConfirmButton: true,
          timer: 2000,
        });
      }

      //  navigate(route.settings[0].path);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        (isCreateMode
          ? t("personalSettings.messages.createFailedMessage") ||
            "Failed to create user."
          : t("personalSettings.messages.saveFailedMessage"));
      Swal.fire({
        icon: "error",
        title: isCreateMode
          ? t("personalSettings.messages.createFailed") || "Create Failed"
          : t("personalSettings.messages.saveFailed"),
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <main className="settings-content-main w-100">
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
            password: "",
            timezoneId: "",
            roleId: "",
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
            userId={isCreateMode ? null : userId || user?.id}
            userIdFromParams={userId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isCreateMode={isCreateMode}
          />
        </FormProvider>
      </div>
    </main>
  );
};

/**
 * Personal Settings Content component.
 * Handles fetching user details and populating the form.
 *
 * @param {Object} props
 * @param {string|number|null} props.userId - User ID to fetch details for (null for create mode)
 * @param {string|number|undefined} props.userIdFromParams - User ID from URL params (for determining if role field should show)
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.setIsLoading - Function to set loading state
 * @param {boolean} props.isCreateMode - Whether we're in create mode
 * @returns {JSX.Element} Form content
 */

const PersonalSettingsContent = React.forwardRef(
  (
    { userId, userIdFromParams, isLoading, setIsLoading, isCreateMode },
    ref
  ) => {
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

    // State for roles
    const [roles, setRoles] = React.useState([]);
    const [rolesLoading, setRolesLoading] = React.useState(false);

    // Determine if role field should be shown (only for create mode or when editing specific user via userId param)
    const shouldShowRoleField = React.useMemo(() => {
      return isCreateMode || !!userIdFromParams;
    }, [isCreateMode, userIdFromParams]);

    // Fetch roles when needed (only for create mode or when editing specific user)
    React.useEffect(() => {
      const fetchRoles = async () => {
        if (!shouldShowRoleField) return;

        setRolesLoading(true);
        try {
          const rolesData = await getRoles({ tab: "all", limit: 100 });
          // Format roles to match Select component format
          const formattedRoles = Array.isArray(rolesData?.list)
            ? rolesData.list.map((role) => ({
                label: role.name,
                value: role._id,
              }))
            : [];
          setRoles(formattedRoles);
        } catch (error) {
          console.error("Error fetching roles:", error);
          setRoles([]);
        } finally {
          setRolesLoading(false);
        }
      };

      fetchRoles();
    }, [shouldShowRoleField]);

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
        // Skip fetching if in create mode or no userId
        if (isCreateMode || !userId) return;

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
            roleId: userData?.roleId?._id || userData?.role?._id || "",
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
    }, [userId, reset, setIsLoading, t, isCreateMode]);

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
        {/* <div className="setting-title">
          <h4>
            {isCreateMode
              ? t("personalSettings.addUserTitle") || "Add New User"
              : t("personalSettings.title")}
          </h4>
        </div> */}
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
          {shouldShowRoleField && (
            <div className="col-md-12">
              <Input
                name="password"
                label={t("formElements.password")}
                placeholder={t("formElements.passwordPlaceholder")}
                type="password"
                required={isCreateMode}
                helpText={
                  isCreateMode
                    ? t("formElements.passwordHelpText") ||
                      "Password must be at least 6 characters"
                    : t("formElements.passwordEditHelpText") ||
                      "Leave blank to keep current password"
                }
              />
            </div>
          )}
          <div className="col-md-12">
            <Select
              name="timezoneId"
              label={t("personalSettings.timezone")}
              options={timezones}
              placeholder={t("personalSettings.selectTimezone")}
              disabled={timezonesLoading}
            />
          </div>
          {shouldShowRoleField && (
            <div className="col-md-12">
              <Select
                name="roleId"
                label={t("personalSettings.role") || "Role"}
                options={roles}
                placeholder={t("personalSettings.selectRole") || "Select Role"}
                disabled={rolesLoading}
              />
            </div>
          )}
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
  userIdFromParams: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  isCreateMode: PropTypes.bool,
};

export default PersonalSettings;
