/**
 * Test suite for Select component.
 * @module feature-module/components/form-elements/select/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "./index";

// Helper component to wrap Select with FormProvider
const FormWrapper = ({ children, schema, defaultValues = {} }) => {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("Select Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render select with label", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [
        { value: "UTC", label: "UTC" },
        { value: "EST", label: "Eastern Time" },
      ];

      render(
        <FormWrapper schema={schema}>
          <Select name="timezone" label="Timezone" options={options} />
        </FormWrapper>
      );

      expect(screen.getByLabelText("Timezone")).toBeInTheDocument();
      expect(screen.getByText("UTC")).toBeInTheDocument();
      expect(screen.getByText("Eastern Time")).toBeInTheDocument();
    });

    it("should render select with custom id", () => {
      const schema = yup.object({
        country: yup.string().optional(),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema}>
          <Select
            name="country"
            label="Country"
            options={options}
            id="custom-select-id"
          />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Country");
      expect(select).toHaveAttribute("id", "custom-select-id");
    });

    it("should render placeholder when provided", () => {
      const schema = yup.object({
        category: yup.string().optional(),
      });

      const options = [
        { value: "1", label: "Category 1" },
        { value: "2", label: "Category 2" },
      ];

      render(
        <FormWrapper schema={schema}>
          <Select
            name="category"
            label="Category"
            options={options}
            placeholder="Select a category"
          />
        </FormWrapper>
      );

      expect(screen.getByText("Select a category")).toBeInTheDocument();
    });

    it("should render required indicator when required", () => {
      const schema = yup.object({
        country: yup.string().required(),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema}>
          <Select name="country" label="Country" options={options} required />
        </FormWrapper>
      );

      const requiredIndicator = screen.getByLabelText("required");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator.textContent).toBe("*");
    });
  });

  describe("Options Rendering", () => {
    it("should render options from array", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [
        { value: "UTC", label: "UTC" },
        { value: "EST", label: "Eastern Time" },
        { value: "PST", label: "Pacific Time" },
      ];

      render(
        <FormWrapper schema={schema}>
          <Select name="timezone" label="Timezone" options={options} />
        </FormWrapper>
      );

      options.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it("should render disabled options", () => {
      const schema = yup.object({
        option: yup.string().optional(),
      });

      const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2", disabled: true },
      ];

      render(
        <FormWrapper schema={schema}>
          <Select name="option" label="Option" options={options} />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Option");
      const option2 = select.querySelector('option[value="2"]');
      expect(option2).toBeDisabled();
    });

    it("should render children when provided instead of options", () => {
      const schema = yup.object({
        category: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Select name="category" label="Category">
            <option value="">Select category</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
          </Select>
        </FormWrapper>
      );

      expect(screen.getByText("Select category")).toBeInTheDocument();
      expect(screen.getByText("Category 1")).toBeInTheDocument();
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
  });

  describe("Validation and Errors", () => {
    it("should display error message when validation fails", async () => {
      const schema = yup.object({
        country: yup.string().required("Country is required."),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ country: "" }}>
          <Select name="country" label="Country" options={options} required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Country is required.");
      expect(screen.getByText("Country is required.")).toBeInTheDocument();
    });

    it("should add is-invalid class when error exists", async () => {
      const schema = yup.object({
        category: yup.string().required("Category is required"),
      });

      const options = [{ value: "1", label: "Category 1" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ category: "" }}>
          <Select name="category" label="Category" options={options} required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Category is required");
      const select = screen.getByLabelText("Category");
      expect(select).toHaveClass("is-invalid");
    });

    it("should not display error when showError is false", async () => {
      const schema = yup.object({
        country: yup.string().required("Country is required."),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ country: "" }}>
          <Select
            name="country"
            label="Country"
            options={options}
            required
            showError={false}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      // Wait a bit to ensure error would have appeared
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(screen.queryByText("Country is required.")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [{ value: "UTC", label: "UTC" }];

      render(
        <FormWrapper schema={schema}>
          <Select name="timezone" label="Timezone" options={options} />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Timezone");
      expect(select).toHaveAttribute("aria-label", "Timezone");
    });

    it("should have custom aria-label when provided", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [{ value: "UTC", label: "UTC" }];

      render(
        <FormWrapper schema={schema}>
          <Select
            name="timezone"
            label="Timezone"
            options={options}
            ariaLabel="Select your timezone"
          />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Timezone");
      expect(select).toHaveAttribute("aria-label", "Select your timezone");
    });

    it("should have aria-required when required", () => {
      const schema = yup.object({
        country: yup.string().required(),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema}>
          <Select name="country" label="Country" options={options} required />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Country");
      expect(select).toHaveAttribute("aria-required", "true");
    });

    it("should have aria-invalid when error exists", async () => {
      const schema = yup.object({
        category: yup.string().required("Category is required"),
      });

      const options = [{ value: "1", label: "Category 1" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ category: "" }}>
          <Select name="category" label="Category" options={options} required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText(/required/i);
      const select = screen.getByLabelText("Category");
      expect(select).toHaveAttribute("aria-invalid", "true");
    });

    it("should have aria-describedby when error exists", async () => {
      const schema = yup.object({
        country: yup.string().required("Country is required."),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ country: "" }}>
          <Select name="country" label="Country" options={options} required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Country is required.");
      const select = screen.getByLabelText("Country");
      expect(select).toHaveAttribute("aria-describedby", "country-error");
    });

    it("should have role='alert' on error message", async () => {
      const schema = yup.object({
        country: yup.string().required("Country is required."),
      });

      const options = [{ value: "US", label: "United States" }];

      render(
        <FormWrapper schema={schema} defaultValues={{ country: "" }}>
          <Select name="country" label="Country" options={options} required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText("Country is required.");
      expect(errorMessage).toHaveAttribute("role", "alert");
      expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Form Integration", () => {
    it("should register with React Hook Form", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [{ value: "UTC", label: "UTC" }];

      render(
        <FormWrapper schema={schema}>
          <Select name="timezone" label="Timezone" options={options} />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Timezone");
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute("name", "timezone");
    });

    it("should update form value when option is selected", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [
        { value: "UTC", label: "UTC" },
        { value: "EST", label: "Eastern Time" },
      ];

      render(
        <FormWrapper schema={schema} defaultValues={{ timezone: "" }}>
          <Select name="timezone" label="Timezone" options={options} />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Timezone");
      fireEvent.change(select, { target: { value: "EST" } });

      expect(select).toHaveValue("EST");
    });

    it("should accept additional select props", () => {
      const schema = yup.object({
        category: yup.string().optional(),
      });

      const options = [{ value: "1", label: "Category 1" }];

      render(
        <FormWrapper schema={schema}>
          <Select
            name="category"
            label="Category"
            options={options}
            selectProps={{ autoComplete: "off", multiple: false }}
          />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Category");
      expect(select).toHaveAttribute("autoComplete", "off");
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [{ value: "UTC", label: "UTC" }];

      render(
        <FormWrapper schema={schema}>
          <Select
            name="timezone"
            label="Timezone"
            options={options}
            disabled
          />
        </FormWrapper>
      );

      const select = screen.getByLabelText("Timezone");
      expect(select).toBeDisabled();
    });
  });

  describe("Custom Styling", () => {
    it("should apply custom className", () => {
      const schema = yup.object({
        timezone: yup.string().optional(),
      });

      const options = [{ value: "UTC", label: "UTC" }];

      const { container } = render(
        <FormWrapper schema={schema}>
          <Select
            name="timezone"
            label="Timezone"
            options={options}
            className="custom-class"
          />
        </FormWrapper>
      );

      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });
  });
});

