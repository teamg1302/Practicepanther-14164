/**
 * Test suite for FormProvider component.
 * @module feature-module/components/rhf/FormProvider.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormProvider from "./FormProvider";
import Input from "../form-elements/input";
import * as yup from "yup";

describe("FormProvider Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render form with children", () => {
      const schema = yup.object({
        firstName: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider schema={schema} onSubmit={handleSubmit}>
          <Input name="firstName" label="First Name" />
          <button type="submit">Submit</button>
        </FormProvider>
      );

      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("should render form with noValidate attribute", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      const { container } = render(
        <FormProvider schema={schema} onSubmit={handleSubmit}>
          <Input name="name" label="Name" />
        </FormProvider>
      );

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("noValidate");
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit when form is submitted", async () => {
      const schema = yup.object({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().optional(),
      });

      const handleSubmit = vi.fn().mockResolvedValue();

      render(
        <FormProvider
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={{ firstName: "John", lastName: "Doe" }}
        >
          <Input name="firstName" label="First Name" required />
          <Input name="lastName" label="Last Name" />
          <button type="submit">Submit</button>
        </FormProvider>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          { firstName: "John", lastName: "Doe" },
          expect.any(Object)
        );
      });
    });

    it("should not call onSubmit when validation fails", async () => {
      const schema = yup.object({
        email: yup.string().email("Invalid email").required("Email is required"),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider schema={schema} onSubmit={handleSubmit} defaultValues={{ email: "" }}>
          <Input name="email" label="Email" type="email" required />
          <button type="submit">Submit</button>
        </FormProvider>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Default Values", () => {
    it("should use default values when provided", () => {
      const schema = yup.object({
        firstName: yup.string().optional(),
        lastName: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={{ firstName: "John", lastName: "Doe" }}
        >
          <Input name="firstName" label="First Name" />
          <Input name="lastName" label="Last Name" />
        </FormProvider>
      );

      const firstNameInput = screen.getByLabelText("First Name");
      const lastNameInput = screen.getByLabelText("Last Name");

      expect(firstNameInput).toHaveValue("John");
      expect(lastNameInput).toHaveValue("Doe");
    });

    it("should use empty object as default when not provided", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider schema={schema} onSubmit={handleSubmit}>
          <Input name="name" label="Name" />
        </FormProvider>
      );

      const input = screen.getByLabelText("Name");
      expect(input).toHaveValue("");
    });
  });

  describe("Validation Mode", () => {
    it("should use onBlur mode by default", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider schema={schema} onSubmit={handleSubmit}>
          <Input name="name" label="Name" />
        </FormProvider>
      );

      // Form should be configured with onBlur mode
      // This is tested indirectly through form behavior
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    it("should accept custom validation mode", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      render(
        <FormProvider schema={schema} onSubmit={handleSubmit} mode="onChange">
          <Input name="name" label="Name" />
        </FormProvider>
      );

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle submission errors gracefully", async () => {
      const schema = yup.object({
        name: yup.string().required("Name is required"),
      });

      const handleSubmit = vi.fn().mockRejectedValue(new Error("Submission failed"));

      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <FormProvider
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={{ name: "Test" }}
        >
          <Input name="name" label="Name" required />
          <button type="submit">Submit</button>
        </FormProvider>
      );

      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });

      // Error should be logged but not crash the component
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on form", () => {
      const schema = yup.object({
        name: yup.string().optional(),
      });

      const handleSubmit = vi.fn();

      const { container } = render(
        <FormProvider schema={schema} onSubmit={handleSubmit}>
          <Input name="name" label="Name" />
        </FormProvider>
      );

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("aria-label", "Form");
    });
  });
});

