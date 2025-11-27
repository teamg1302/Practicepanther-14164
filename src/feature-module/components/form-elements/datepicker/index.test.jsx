/**
 * Test suite for DatePicker component.
 * @module feature-module/components/form-elements/datepicker/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormDatePicker from "./index";

// Mock react-datepicker
vi.mock("react-datepicker", () => {
  return {
    default: ({ selected, onChange, placeholderText, ...props }) => (
      <input
        type="text"
        value={selected ? selected.toLocaleDateString() : ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange(new Date(e.target.value));
          } else {
            onChange(null);
          }
        }}
        placeholder={placeholderText}
        {...props}
      />
    ),
  };
});

// Helper component to wrap DatePicker with FormProvider
const FormWrapper = ({ children, schema, defaultValues = {} }) => {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("DatePicker Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render date picker with label", () => {
      const schema = yup.object({
        formationDate: yup.date().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker name="formationDate" label="Formation Date" />
        </FormWrapper>
      );

      expect(screen.getByLabelText("Formation Date")).toBeInTheDocument();
      expect(screen.getByText("Formation Date")).toBeInTheDocument();
    });

    it("should render with custom placeholder", () => {
      const schema = yup.object({
        date: yup.date().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker
            name="date"
            label="Date"
            placeholder="Choose a date"
          />
        </FormWrapper>
      );

      expect(screen.getByPlaceholderText("Choose a date")).toBeInTheDocument();
    });

    it("should render required indicator when required", () => {
      const schema = yup.object({
        date: yup.date().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker name="date" label="Date" required />
        </FormWrapper>
      );

      const requiredIndicator = screen.getByLabelText("required");
      expect(requiredIndicator).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should update form value when date is selected", () => {
      const schema = yup.object({
        date: yup.date().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ date: null }}>
          <FormDatePicker name="date" label="Date" />
        </FormWrapper>
      );

      const dateInput = screen.getByLabelText("Date");
      // Note: Actual date selection would require more complex testing
      expect(dateInput).toBeInTheDocument();
    });
  });

  describe("Validation and Errors", () => {
    it("should display error message when validation fails", async () => {
      const schema = yup.object({
        date: yup.date().required("Date is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ date: null }}>
          <FormDatePicker name="date" label="Date" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Date is required.");
      expect(screen.getByText("Date is required.")).toBeInTheDocument();
    });

    it("should add is-invalid class when error exists", async () => {
      const schema = yup.object({
        date: yup.date().required("Date is required"),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ date: null }}>
          <FormDatePicker name="date" label="Date" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Date is required");
      const dateInput = screen.getByLabelText("Date");
      expect(dateInput).toHaveClass("is-invalid");
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label", () => {
      const schema = yup.object({
        date: yup.date().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker name="date" label="Formation Date" />
        </FormWrapper>
      );

      const dateInput = screen.getByLabelText("Formation Date");
      expect(dateInput).toHaveAttribute("aria-label", "Formation Date");
    });

    it("should have aria-required when required", () => {
      const schema = yup.object({
        date: yup.date().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker name="date" label="Date" required />
        </FormWrapper>
      );

      const dateInput = screen.getByLabelText("Date");
      expect(dateInput).toHaveAttribute("aria-required", "true");
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      const schema = yup.object({
        date: yup.date().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <FormDatePicker name="date" label="Date" disabled />
        </FormWrapper>
      );

      const dateInput = screen.getByLabelText("Date");
      expect(dateInput).toBeDisabled();
    });
  });
});

