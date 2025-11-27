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

import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import * as yup from "yup";
import Swal from "sweetalert2";
import { FormProvider } from "@/feature-module/components/rhf";
import Input from "@/feature-module/components/form-elements/input";
import Switch from "@/feature-module/components/form-elements/switch";
import Select from "@/feature-module/components/form-elements/select";

const personalSettingsSchema = yup.object({
  firstName: yup.string().trim().required("First name is required."),
  lastName: yup.string().trim().required("Last name is required."),
  middleName: yup.string().trim().optional(),
  jobTitle: yup.string().trim().optional(),
  mobile: yup.string().trim().optional(),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  timezone: yup.string().trim().optional(),
  home: yup.string().trim().optional(),
  office: yup.string().trim().optional(),
  hourlyRate: yup
    .number()
    .typeError("Hourly rate must be a number.")
    .positive("Hourly rate must be a positive number.")
    .required("Hourly rate is required."),
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
});

/**
 * Timezone options for the select dropdown.
 * @type {Array<{value: string, label: string}>}
 */

const roundTimeEntryTypeOptions = [
  { label: "Up", value: "up" },
  { label: "Down", value: "down" },
];

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
  /**
   * Handles form submission with validation and error handling.
   *
   * @param {Object} formData - Form data from React Hook Form
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    try {
      // Form data already includes switch states from React Hook Form
      const submitData = {
        ...formData,
      };

      // Here you can add your API call
      // await updateGeneralSettings(submitData);

      Swal.fire({
        icon: "success",
        title: "Settings Saved",
        text: "Your general settings have been saved successfully.",
        showConfirmButton: true,
        timer: 2000,
      });

      console.log("Form Data:", submitData);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to save settings. Please try again.";
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
        }}
        onSubmit={onSubmit}
      >
        <div className="setting-title">
          <h4>Personal Settings </h4>
        </div>
        {/* <div className="card-title-head">
                                <h6>
                                    <span>
                                        
                                        <User className="feather-chevron-up"/>
                                    </span>
                                    Employee Information
                                </h6>
                            </div> */}
        <div className="profile-pic-upload">
          <div className="profile-pic">
            <span>
              <PlusCircle className="plus-down-add" />
              Profile Photo
            </span>
          </div>
          <div className="new-employee-field">
            <div className="mb-0">
              <div className="image-upload mb-0">
                <input type="file" />
                <div className="image-uploads">
                  <h4>Change Image</h4>
                </div>
              </div>
              <span>
                For better preview recommended size is 450px x 450px. Max size
                5MB.
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <Input name="firstName" label="First Name" type="text" required />
          </div>
          <div className="col-md-4">
            <Input name="middleName" label="Middle Name" type="text" />
          </div>
          <div className="col-md-4">
            <Input name="lastName" label="Last Name" type="text" required />
          </div>
          <div className="col-md-12">
            <Input name="jobTitle" label="Job Title" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="mobile" label="Mobile" type="text" />
          </div>
          <div className="col-md-12">
            <Input
              name="email"
              label="Email"
              type="email"
              required
              helpText="The email address to sign in. This email can not be used for two accounts."
            />
          </div>
          <div className="col-md-12">
            <Select
              name="timezone"
              label="Timezone"
              options={timezoneOptions}
              placeholder="Select your timezone"
            />
          </div>
        </div>
        <div className="card-title-head">
          <h6>
            <span>
              <i data-feather="map-pin" className="feather-chevron-up" />
            </span>
            Contact Information
          </h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Input name="home" label="Home" type="text" />
          </div>
          <div className="col-md-12">
            <Input name="office" label="Office" type="text" />
          </div>
        </div>

        <div className="card-title-head">
          <h6>
            <span>
              <i data-feather="map-pin" className="feather-chevron-up" />
            </span>
            Time Entries
          </h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Input
              name="hourlyRate"
              label="Hourly Rate (TRY)"
              type="number"
              required
            />
          </div>
          <div className="col-md-4">
            <Switch
              name="roundTimeEntries"
              label="Round time entries?"
              defaultValue={false}
            />
          </div>

          <RoundTimeEntryTypeSelect />
        </div>

        <div className="card-title-head">
          <h6>
            <span>
              <i data-feather="map-pin" className="feather-chevron-up" />
            </span>
            Notification Emails
          </h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Switch
              name="dailyAgendaEmail"
              label="Receive daily agenda email?"
              defaultValue={false}
            />
          </div>
        </div>
        <FormSubmitButtons />
      </FormProvider>
    </div>
  );
};

/**
 * Round Time Entry Type Select component.
 * Conditionally renders based on roundTimeEntries switch value.
 *
 * @returns {JSX.Element|null} Select component or null
 */
const RoundTimeEntryTypeSelect = () => {
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
          label="Round Time Entry Type"
          options={roundTimeEntryTypeOptions}
          placeholder="Select rounding type"
          helpText="to the nearest"
        />
      </div>
      <div className="col-md-4">
        <Input
          name="fractionOfTheHour"
          label="Fraction of the hour"
          type="number"
          helpText="fraction of the hour.
"
        />
      </div>
    </>
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
        aria-label={isSubmitting ? "Saving settings" : "Save changes"}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default PersonalSettings;
