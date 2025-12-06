/**
 * Test suite for Textarea component.
 * @module feature-module/components/form-elements/textarea/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "./index";

// Helper component to wrap Textarea with FormProvider
const FormWrapper = ({ children, schema, defaultValues = {} }) => {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("Textarea Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render textarea with label", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" />
        </FormWrapper>
      );

      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("should render textarea with custom id", () => {
      const schema = yup.object({
        notes: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="notes" label="Notes" id="custom-notes-id" />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Notes");
      expect(textarea).toHaveAttribute("id", "custom-notes-id");
    });

    it("should render placeholder when provided", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea
            name="description"
            label="Description"
            placeholder="Enter description"
          />
        </FormWrapper>
      );

      expect(
        screen.getByPlaceholderText("Enter description")
      ).toBeInTheDocument();
    });

    it("should render required indicator when required", () => {
      const schema = yup.object({
        description: yup.string().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" required />
        </FormWrapper>
      );

      const requiredIndicator = screen.getByLabelText("required");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator.textContent).toBe("*");
    });

    it("should render with custom rows", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" rows={10} />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("rows", "10");
    });
  });

  describe("Character Count", () => {
    it("should display character count when maxLength is provided", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" maxLength={60} />
        </FormWrapper>
      );

      expect(screen.getByText(/0 \/ 60 Characters/)).toBeInTheDocument();
    });

    it("should update character count as user types", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" maxLength={60} />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      fireEvent.change(textarea, { target: { value: "Hello" } });

      expect(screen.getByText(/5 \/ 60 Characters/)).toBeInTheDocument();
    });

    it("should show maximum reached message when limit is reached", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper
          schema={schema}
          defaultValues={{ description: "A".repeat(60) }}
        >
          <Textarea name="description" label="Description" maxLength={60} />
        </FormWrapper>
      );

      expect(screen.getByText(/(Maximum reached)/)).toBeInTheDocument();
    });

    it("should not display character count when maxLength is not provided", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" />
        </FormWrapper>
      );

      expect(screen.queryByText(/Characters/)).not.toBeInTheDocument();
    });
  });

  describe("Validation and Errors", () => {
    it("should display error message when validation fails", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea name="description" label="Description" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Description is required.");
      expect(screen.getByText("Description is required.")).toBeInTheDocument();
    });

    it("should add is-invalid class when error exists", async () => {
      const schema = yup.object({
        description: yup
          .string()
          .min(10, "Description must be at least 10 characters")
          .required("Description is required"),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea name="description" label="Description" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText(/required/i);
      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveClass("is-invalid");
    });

    it("should validate maxLength and show error", async () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper
          schema={schema}
          defaultValues={{ description: "A".repeat(61) }}
        >
          <Textarea name="description" label="Description" maxLength={60} />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText(/must not exceed 60 characters/i);
      expect(
        screen.getByText(/must not exceed 60 characters/i)
      ).toBeInTheDocument();
    });

    it("should not display error when showError is false", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea
            name="description"
            label="Description"
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

      expect(
        screen.queryByText("Description is required.")
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("aria-label", "Description");
    });

    it("should have custom aria-label when provided", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea
            name="description"
            label="Description"
            ariaLabel="Enter your description"
          />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("aria-label", "Enter your description");
    });

    it("should have aria-required when required", () => {
      const schema = yup.object({
        description: yup.string().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" required />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("aria-required", "true");
    });

    it("should have aria-invalid when error exists", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required"),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea name="description" label="Description" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText(/required/i);
      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("should have aria-describedby when error exists", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea name="description" label="Description" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Description is required.");
      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("aria-describedby", "description-error");
    });

    it("should have role='alert' on error message", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea name="description" label="Description" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText("Description is required.");
      expect(errorMessage).toHaveAttribute("role", "alert");
      expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Form Integration", () => {
    it("should register with React Hook Form", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea name="description" label="Description" />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toBeInTheDocument();
      // Textarea should be registered and accessible
      expect(textarea).toHaveAttribute("name", "description");
    });

    it("should accept additional textarea props", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea
            name="description"
            label="Description"
            textareaProps={{ autoComplete: "off", spellCheck: false }}
          />
        </FormWrapper>
      );

      const textarea = screen.getByLabelText("Description");
      expect(textarea).toHaveAttribute("autoComplete", "off");
      expect(textarea).toHaveAttribute("spellCheck", "false");
    });
  });

  describe("Help Text", () => {
    it("should display help text when provided", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Textarea
            name="description"
            label="Description"
            helpText="Provide a detailed description."
          />
        </FormWrapper>
      );

      expect(
        screen.getByText("Provide a detailed description.")
      ).toBeInTheDocument();
    });

    it("should not display help text when error exists", async () => {
      const schema = yup.object({
        description: yup.string().required("Description is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ description: "" }}>
          <Textarea
            name="description"
            label="Description"
            helpText="Provide a detailed description."
            required
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Description is required.");
      expect(
        screen.queryByText("Provide a detailed description.")
      ).not.toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("should apply custom className", () => {
      const schema = yup.object({
        description: yup.string().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Textarea
            name="description"
            label="Description"
            className="custom-class"
          />
        </FormWrapper>
      );

      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
