import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import PropTypes from "prop-types";
import { PlusCircle, Trash2 } from "feather-icons-react/build/IconComponents";
import { useFieldArray } from "react-hook-form";
import { all_routes } from "@/Router/all_routes";
import PageLayout from "@/feature-module/components/list-page-layout";
import { getUsers } from "@/core/services/userService";
import { getContacts } from "@/core/services/contactsService";
import { getMatters } from "@/core/services/mattersService";
import {
  FromButtonGroup,
  StandardButton,
} from "@/feature-module/components/buttons";
import { FormProvider, useFormContext } from "@/feature-module/components/rhf";
import { getValidationRules } from "@/core/validation-rules";
import {
  AsyncSelectPagination,
  Input,
  Switch,
  Textarea,
  Select,
} from "@/feature-module/components/form-elements";

const MultipleTimeEntries = () => {
  const navigate = useNavigate();
  const route = all_routes;

  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      yup.object({
        timeEntries: yup.array().of(
          yup.object({
            contact: getValidationRules(t).textOnlyRequired,
            matter: getValidationRules(t).textOnlyRequired,
            date: getValidationRules(t).textOnlyRequired,
            billedBy: getValidationRules(t).textOnlyRequired,
            rate: getValidationRules(t).textOnlyRequired,
            hours: getValidationRules(t).textOnlyRequired,
            minutes: getValidationRules(t).textOnlyRequired,
          })
        ),
      }),
    [t]
  );

  const [defaultValues] = useState({
    timeEntries: [
      {
        hours: "01",
        minutes: "00",
        totalTime: "00:00:00",
        date: "",
        description: "",
        contact: "",
        matter: "",
        item: "",
        isBillable: false,
        billedBy: "",
        rate: "",
      },
    ],
  });

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
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
          redirect: route.headers[3].path,
        },
        {
          label: "Multiple Time Entries",
          redirect: "#",
        },
      ]}
      isFormLayout={true}
      title="Multiple Time Entries"
      subtitle="Add multiple time entries at once"
      actions={{
        onPrevious: {
          text: "Back to Time Entries",
          onClick: () => navigate(route.headers[3].path),
        },
      }}
    >
      <FormProvider
        schema={validationSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        mode="onSubmit"
        formOptions={{
          reValidateMode: "onChange",
        }}
      >
        <TimeEntryForm />
      </FormProvider>
    </PageLayout>
  );
};

const TimeEntryForm = () => {
  const {
    formState: { isSubmitting },
    reset,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "timeEntries",
  });

  const handleAddTimeEntry = () => {
    const newIndex = fields.length;
    append({
      hours: "00",
      minutes: "00",
      date: "",
      description: "",
      contact: "",
      matter: "",
      item: "",
      isBillable: false,
      billedBy: "",
      rate: "",
    });

    // Scroll to the newly added entry after DOM update
    setTimeout(() => {
      const element = document.getElementById(`time-entry-${newIndex + 1}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleDeleteTimeEntry = (index) => {
    if (fields.length > 1) {
      Swal.fire({
        title: "Delete Time Entry?",
        text: "Are you sure you want to delete this time entry?",
        icon: "warning",
        showCancelButton: true,

        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-primary text-white",
        cancelButtonClass: "btn btn-secondary text-white",
      }).then((result) => {
        if (result.isConfirmed) {
          remove(index);
          //   Swal.fire({
          //     title: "Deleted!",
          //     text: "Time entry has been deleted.",
          //     icon: "success",
          //     timer: 1500,
          //     buttonsStyling: false,
          //     confirmButtonClass: "btn btn-primary",
          //   });
        }
      });
    } else {
      Swal.fire({
        title: "Cannot Delete",
        text: "You must have at least one time entry.",
        icon: "warning",
        timer: 1500,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-primary",
      });
    }
  };

  return (
    <>
      {fields.map((field, index) => (
        <TimeEntryItem
          key={field.id}
          index={index}
          onDelete={() => handleDeleteTimeEntry(index)}
        />
      ))}
      <div className="row my-3">
        <div className="col-md-12">
          <StandardButton
            label="New Time Entry"
            icon={<PlusCircle size={16} />}
            onClick={handleAddTimeEntry}
          />
        </div>
      </div>
      <FromButtonGroup isSubmitting={isSubmitting} reset={reset} />
    </>
  );
};

const TimeEntryItem = ({ index, onDelete }) => {
  return (
    <div
      className="row my-3  border-bottom border-primary pb-3"
      id={`time-entry-${index + 1}`}
    >
      <div className="col-md-12 mb-2">
        <h5 className="text-muted">Time Entry {index + 1}</h5>
      </div>
      <div className="col-md-3">
        <AsyncSelectPagination
          name={`timeEntries.${index}.contact`}
          label={"Contact"}
          api={getContacts}
          pageSize={50}
          searchKey={"search"}
          required={true}
        />
      </div>
      <div className="col-md-3">
        <AsyncSelectPagination
          name={`timeEntries.${index}.matter`}
          label={"Matter"}
          api={getMatters}
          pageSize={50}
          searchKey={"search"}
          required={true}
        />
      </div>
      <div className="col-md-3">
        <Input
          name={`timeEntries.${index}.date`}
          label={"Date"}
          type="date"
          required={true}
        />
      </div>
      <div className="col-md-3">
        <Switch name={`timeEntries.${index}.isBillable`} label={"Billable"} />
      </div>
      <div className="col-md-3">
        <Select
          name={`timeEntries.${index}.item`}
          label={"Item"}
          options={[
            { value: "1", label: "Item 1" },
            { value: "2", label: "Item 2" },
            { value: "3", label: "Item 3" },
          ]}
        />
      </div>
      <div className="col-md-3">
        <AsyncSelectPagination
          name={`timeEntries.${index}.billedBy`}
          label={"Billed By"}
          api={getUsers}
          pageSize={50}
          searchKey={"search"}
          required={true}
        />
      </div>
      <div className="col-md-3">
        <Input
          name={`timeEntries.${index}.hours`}
          label={"Hours"}
          type="number"
          required={true}
        />
      </div>
      <div className="col-md-3">
        <Input
          name={`timeEntries.${index}.rate`}
          label={"Rate"}
          type="number"
          required={true}
        />
      </div>
      <div className="col-md-12">
        <Textarea
          name={`timeEntries.${index}.description`}
          label={"Description"}
        />
      </div>
      {index > 0 && (
        <div className="col-md-12 mt-2 d-flex justify-content-end">
          <StandardButton
            label="Delete"
            icon={<Trash2 size={16} />}
            onClick={onDelete}
            className="btn-danger"
          />
        </div>
      )}
    </div>
  );
};

TimeEntryItem.propTypes = {
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MultipleTimeEntries;
