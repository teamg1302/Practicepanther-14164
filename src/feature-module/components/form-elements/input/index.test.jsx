/**
 * Test suite for Input component.
 * @module feature-module/components/form-elements/input/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as yup from "yup";
import FormProvider from "../../rhf/FormProvider";
import Input from "./index";

// Helper component to wrap Input with FormProvider
const FormWrapper = ({ children, schema, defaultValues = {} }) => {
  const handleSubmit = vi.fn();

  return (
    <FormProvider
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      mode="onSubmit"
    >
      {children}
    </FormProvider>
  );
};

describe("Input Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render input with label", () => {
      const schema = yup.object({
        firstName: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="firstName" label="First Name" />
        </FormWrapper>
      );

      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByText("First Name")).toBeInTheDocument();
    });

    it("should render input with custom id", () => {
      const schema = yup.object({
        email: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="email" label="Email" id="custom-email-id" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("id", "custom-email-id");
    });

    it("should render placeholder when provided", () => {
      const schema = yup.object({
        search: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input
            name="search"
            label="Search"
            placeholder="Enter search term"
          />
        </FormWrapper>
      );

      expect(screen.getByPlaceholderText("Enter search term")).toBeInTheDocument();
    });

    it("should render required indicator when required", () => {
      const schema = yup.object({
        firstName: yup.string().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="firstName" label="First Name" required />
        </FormWrapper>
      );

      const requiredIndicator = screen.getByLabelText("required");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator.textContent).toBe("*");
    });
  });

  describe("Input Types", () => {
    it("should render text input by default", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="name" label="Name" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Name");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should render email input when type is email", () => {
      const schema = yup.object({
        email: yup.string().email().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="email" label="Email" type="email" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("type", "email");
    });

    it("should render number input when type is number", () => {
      const schema = yup.object({
        age: yup.number().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="age" label="Age" type="number" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Age");
      expect(input).toHaveAttribute("type", "number");
    });
  });

  describe("Validation and Errors", () => {
    it("should display error message when validation fails", async () => {
      const schema = yup.object({
        firstName: yup.string().required("First name is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ firstName: "" }}>
          <Input name="firstName" label="First Name" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("First name is required.");
      expect(screen.getByText("First name is required.")).toBeInTheDocument();
    });

    it("should add is-invalid class when error exists", async () => {
      const schema = yup.object({
        email: yup.string().email("Invalid email").required("Email is required"),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ email: "" }}>
          <Input name="email" label="Email" type="email" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("Email is required");
      const input = screen.getByLabelText("Email");
      expect(input).toHaveClass("is-invalid");
    });

    it("should not display error when showError is false", async () => {
      const schema = yup.object({
        firstName: yup.string().required("First name is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ firstName: "" }}>
          <Input name="firstName" label="First Name" required showError={false} />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      // Wait a bit to ensure error would have appeared
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(screen.queryByText("First name is required.")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="name" label="Full Name" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Full Name");
      expect(input).toHaveAttribute("aria-label", "Full Name");
    });

    it("should have custom aria-label when provided", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input
            name="name"
            label="Full Name"
            ariaLabel="Enter your full name"
          />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Full Name");
      expect(input).toHaveAttribute("aria-label", "Enter your full name");
    });

    it("should have aria-required when required", () => {
      const schema = yup.object({
        email: yup.string().required(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="email" label="Email" required />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("should have aria-invalid when error exists", async () => {
      const schema = yup.object({
        email: yup.string().email("Invalid email").required(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ email: "" }}>
          <Input name="email" label="Email" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText(/required/i);
      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should have aria-describedby when error exists", async () => {
      const schema = yup.object({
        firstName: yup.string().required("First name is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ firstName: "" }}>
          <Input name="firstName" label="First Name" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await screen.findByText("First name is required.");
      const input = screen.getByLabelText("First Name");
      expect(input).toHaveAttribute("aria-describedby", "firstName-error");
    });

    it("should have role='alert' on error message", async () => {
      const schema = yup.object({
        firstName: yup.string().required("First name is required."),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ firstName: "" }}>
          <Input name="firstName" label="First Name" required />
          <button type="submit">Submit</button>
        </FormWrapper>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText("First name is required.");
      expect(errorMessage).toHaveAttribute("role", "alert");
      expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Form Integration", () => {
    it("should register with React Hook Form", () => {
      const schema = yup.object({
        firstName: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input name="firstName" label="First Name" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("First Name");
      expect(input).toBeInTheDocument();
      // Input should be registered and accessible
      expect(input).toHaveAttribute("name", "firstName");
    });

    it("should accept additional input props", () => {
      const schema = yup.object({
        search: yup.string().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Input
            name="search"
            label="Search"
            inputProps={{ autoComplete: "off", maxLength: 50 }}
          />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Search");
      expect(input).toHaveAttribute("autoComplete", "off");
      expect(input).toHaveAttribute("maxLength", "50");
    });
  });

  describe("Custom Styling", () => {
    it("should apply custom className", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Input name="name" label="Name" className="custom-class" />
        </FormWrapper>
      );

      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });
  });
});

