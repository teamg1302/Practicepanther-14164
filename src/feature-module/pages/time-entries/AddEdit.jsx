import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";
import PageLayout from "@/feature-module/components/list-page-layout";

import { getContacts } from "@/core/services/contactsService";
import { getMatters } from "@/core/services/mattersService";
import {
  FromButtonGroup,
  StandardButton,
} from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import EntityFormView from "@/feature-module/components/entity-form-view";
import { getHours, getMinutes } from "@/core/utilities/utility";
import { PauseOutlined, TimerOutlined } from "@mui/icons-material";

/**
 * Timer Display Component
 * Displays the total time from form context
 */
const TimerDisplay = () => {
  const { watch } = useFormContext();
  const watchTotalTime = watch("totalTime");

  return (
    <div>
      <span className="text-dark fs-2">{watchTotalTime || "00:00:00"}</span>
    </div>
  );
};

/**
 * Start Timer Button Component
 * Handles timer start/stop functionality
 */
const StartTimerButton = () => {
  const { watch, setValue } = useFormContext();
  const timerRunning = watch("timerRunning");
  const totalTime = watch("totalTime");
  const startTimeRef = React.useRef(null);
  const intervalRef = React.useRef(null);
  const pausedElapsedRef = React.useRef(0);

  /**
   * Formats time in HH:MM:SS format
   */
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  /**
   * Parses time string (HH:MM:SS) to total seconds
   */
  const parseTimeToSeconds = (timeString) => {
    if (!timeString || timeString === "00:00:00") return 0;
    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  /**
   * Handles timer start/pause
   */
  const handleStartTimer = () => {
    if (timerRunning) {
      // Timer is running, pause it
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Calculate elapsed time and add to paused elapsed
      if (startTimeRef.current) {
        const now = new Date();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        pausedElapsedRef.current += elapsed;

        // Update totalTime with accumulated time
        const formattedTime = formatTime(pausedElapsedRef.current);
        setValue("totalTime", formattedTime);
      }

      setValue("timerRunning", false);
      startTimeRef.current = null;
    } else {
      // Start or resume the timer from last paused time
      // Get current totalTime and convert to seconds
      const currentSeconds = parseTimeToSeconds(totalTime);
      pausedElapsedRef.current = currentSeconds;

      startTimeRef.current = new Date();
      setValue("timerRunning", true);

      // Start interval to update timer every second
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date();
          const elapsed = Math.floor((now - startTimeRef.current) / 1000);
          const totalElapsed = pausedElapsedRef.current + elapsed;
          const formattedTime = formatTime(totalElapsed);
          setValue("totalTime", formattedTime);
        }
      }, 1000);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <StandardButton
        label={timerRunning ? "Pause Timer" : "Start Timer"}
        style={{
          height: "40px !important",
          marginTop: "10px",
        }}
        onClick={handleStartTimer}
        icon={
          timerRunning ? (
            <PauseOutlined fontSize="small" />
          ) : (
            <TimerOutlined fontSize="small" />
          )
        }
      />
    </div>
  );
};

const AddTimeEntry = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const { timeEntryId } = useParams();

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
    hours: "01",
    minutes: "00",
    totalTime: "00:00:00",
    date: "",
    description: "",
    contact: "",
    matter: "",
    item: "",
    startTimer: false,
    endTimer: false,
    timerRunning: false,
  });

  const fields = useMemo(
    () => [
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Link To"}</h6>
            <small className="text-muted">
              {"Enter the time entry's link to contact"}
            </small>
          </div>
        ),
      },
      {
        id: "contact",
        col: 6,
        name: "contact",
        label: "Contact",
        type: "async-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        id: "matter",
        col: 6,
        name: "matter",
        label: "Matter",
        type: "async-select-pagination",
        api: getMatters,
        pageSize: 50,
        searchKey: "search",
        required: true,
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Time Entries"}</h6>
            <small className="text-muted">
              {"Enter the time entry's details"}
            </small>
          </div>
        ),
      },
      {
        id: "item   ",
        col: 6,
        name: "item",
        label: "Item",
        type: "select",
        options: [
          { label: "Time Entry", value: "timeEntry" },
          { label: "Time Entry", value: "timeEntry" },
        ],
        required: true,
      },
      {
        id: "hours",
        col: 1,
        name: "hours",
        label: "Hours",
        type: "select",
        options: getHours(),
        required: true,
      },
      {
        id: "minutes",
        col: 1,
        name: "minutes",
        label: "Minutes",
        type: "select",
        options: getMinutes(),
        required: true,
      },
      {
        type: "ui",
        col: 2,
        className: "d-flex  align-items-center ",
        element: <StartTimerButton />,
      },
      {
        type: "ui",
        col: 2,
        className: "d-flex align-items-center justify-content-start",
        element: <TimerDisplay />,
      },
      {
        id: "date",
        col: 6,
        name: "date",
        label: "Date",
        type: "date",
      },
      {
        id: "description",
        col: 6,
        name: "description",
        label: "Description",
        type: "textarea",
      },
      {
        type: "ui",
        element: (
          <div className="card-title-head mb-3">
            <h6 className="border-bottom-0 mb-0 pb-0">{"Billings"}</h6>
            <small className="text-muted">
              {"Enter the time entry's billing details"}
            </small>
          </div>
        ),
      },
      {
        id: "isBilled",
        col: 6,
        name: "isBilled",
        label: "Is Billed",
        type: "switch",
      },
      {
        id: "billedBy",
        col: 6,
        name: "billedBy",
        label: "Billed By",
        type: "async-select-pagination",
        api: getContacts,
        pageSize: 50,
        searchKey: "search",
      },
      {
        id: "hourlyRate",
        col: 6,
        name: "hourlyRate",
        label: "Hourly Rate",
        type: "number",
        placeholder: "Enter the hourly rate",
      },
      {
        id: "totalAmount",
        col: 6,
        name: "totalAmount",
        label: "Total Amount",
        type: "number",
        placeholder: "Enter the total amount",
      },
    ],
    [t]
  );

  const onSubmit = async (data, event) => {
    try {
      //   const formData = convertToFormData(data);
      //   if (timeEntryId) {
      //     // Update existing contact
      //     await updateTimeEntry(timeEntryId, formData);
      //     Swal.fire({
      //       title:
      //         t("httpMessages.updatedSuccessfullyMessage") ||
      //         "Updated Successfully",
      //       icon: "success",
      //       timer: 1500,
      //     });
      //   } else {
      //     // Create new contact
      //     await createContact(formData);
      //     Swal.fire({
      //       title: t("httpMessages.createdSuccessfullyMessage"),
      //       icon: "success",
      //       timer: 1500,
      //     });
      //     event.target.reset();
      //   }
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
          label: "Time Entries",
          redirect: route.headers[1].path,
        },
        {
          label: timeEntryId ? "Edit Time Entry" : "Add Time Entry",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      title={timeEntryId ? "Edit Time Entry" : "Add Time Entry"}
      subtitle={
        timeEntryId ? "Modify time entry details" : "Create a new time entry"
      }
      actions={{
        onPrevious: {
          text: "Back to Time Entries",
          onClick: () => navigate(route.headers[3].path),
        },
      }}
    >
      <FormProvider
        schema={securitySettingsSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      >
        <TimeEntryForm
          fields={fields}
          timeEntryId={timeEntryId || false}
          t={t}
        />
      </FormProvider>
    </PageLayout>
  );
};
const TimeEntryForm = ({ fields, timeEntryId, t }) => {
  const {
    formState: { isSubmitting },
    reset,
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (timeEntryId) {
      //   const fetchTimeEntry = async () => {
      //     try {
      //       const timeEntry = await getTimeEntryById(timeEntryId);
      //       // Transform the API response to match form structure
      //       const formData = {
      //         image: timeEntry?.image || "",
      //         name: timeEntry?.name || "",
      //         registrationNumber: timeEntry?.registrationNumber || "",
      //         status: contact?.status || "",
      //         website: contact?.website || "",
      //         phoneHome: contact?.phoneHome || "",
      //         phoneMobile: contact?.phoneMobile || "",
      //         phoneOffice: contact?.phoneOffice || "",
      //         fax: contact?.fax || "",
      //         email: contact?.email || "",
      //         preferredContactMethod: contact?.preferredContactMethod || "",
      //         contactNotes: contact?.contactNotes || "",
      //         address1: contact?.address1 || "",
      //         addressLine2: contact?.address2 || contact?.addressLine2 || "",
      //         city: contact?.city || "",
      //         zipCode: contact?.zipCode || "",
      //         countryId: contact?.countryId?._id || contact?.countryId || "",
      //         stateId: contact?.stateId?._id || contact?.stateId || "",
      //         assignedTo: contact?.assignedTo?._id || contact?.assignedTo || "",
      //         tags: contact?.tags || [],
      //         additionalInvoiceRecipients:
      //           contact?.additionalInvoiceRecipients?.map(
      //             (recipient) => recipient._id || recipient
      //           ) || [],
      //       };
      //       // Use setTimeout to ensure form fields are fully mounted
      //       setTimeout(() => {
      //         // Reset form with options to ensure values are set
      //         reset(formData, {
      //           keepDefaultValues: false,
      //           keepValues: false,
      //         });
      //         // Also use setValue for all fields to ensure they update
      //         Object.keys(formData).forEach((key) => {
      //           setValue(key, formData[key], {
      //             shouldValidate: false,
      //             shouldDirty: false,
      //             shouldTouch: false,
      //           });
      //         });
      //       }, 100);
      //     } catch (error) {
      //       console.log("error", error);
      //       Swal.fire({
      //         text: error?.message || t("httpMessages.errorMessage"),
      //         icon: "error",
      //         timer: 1500,
      //       });
      //     }
      //   };
      //   fetchTimeEntry();
    }
  }, [timeEntryId, reset, setValue, t]);

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

TimeEntryForm.propTypes = {
  fields: PropTypes.array.isRequired,
  timeEntryId: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default AddTimeEntry;
