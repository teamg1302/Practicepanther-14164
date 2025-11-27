/**
 * Test suite for Switch component.
 * @module feature-module/components/form-elements/switch/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Switch from "./index";

// Helper component to wrap Switch with FormProvider
const FormWrapper = ({ children, schema, defaultValues = {} }) => {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("Switch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render switch with label", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable Feature" />
        </FormWrapper>
      );

      expect(screen.getByText("Enable Feature")).toBeInTheDocument();
      expect(screen.getByLabelText("Enable Feature")).toBeInTheDocument();
    });

    it("should render switch with custom id", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" id="custom-switch-id" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).toHaveAttribute("id", "custom-switch-id");
    });

    it("should render with default unchecked state", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).not.toBeChecked();
    });

    it("should render with default checked state", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: true }}>
          <Switch name="enabled" label="Enable" defaultValue={true} />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).toBeChecked();
    });
  });

  describe("Toggle Functionality", () => {
    it("should toggle when clicked", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: false }}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).not.toBeChecked();

      fireEvent.click(input);
      expect(input).toBeChecked();

      fireEvent.click(input);
      expect(input).not.toBeChecked();
    });

    it("should not toggle when disabled", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: false }}>
          <Switch name="enabled" label="Enable" disabled />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).toBeDisabled();
      expect(input).not.toBeChecked();

      fireEvent.click(input);
      expect(input).not.toBeChecked();
    });
  });

  describe("Customization", () => {
    it("should use custom active text", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: true }}>
          <Switch name="enabled" label="Enable" activeText="On" />
        </FormWrapper>
      );

      expect(screen.getByText("On")).toBeInTheDocument();
    });

    it("should use custom inactive text", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: false }}>
          <Switch name="enabled" label="Enable" inactiveText="Off" />
        </FormWrapper>
      );

      expect(screen.getByText("Off")).toBeInTheDocument();
    });

    it("should use custom colors", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema} defaultValues={{ enabled: true }}>
          <Switch
            name="enabled"
            label="Enable"
            activeColor="#28a745"
            inactiveColor="#dc3545"
          />
        </FormWrapper>
      );

      const switchElement = container.querySelector('[role="switch"]');
      expect(switchElement).toHaveStyle({ backgroundColor: "#28a745" });
    });

    it("should use custom width and height", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" width={120} height={40} />
        </FormWrapper>
      );

      const label = container.querySelector("label[for]");
      expect(label).toHaveStyle({ width: "120px", height: "40px" });
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable Feature" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable Feature");
      expect(input).toHaveAttribute("aria-label", "Enable Feature");
    });

    it("should have custom aria-label when provided", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch
            name="enabled"
            label="Enable Feature"
            ariaLabel="Toggle feature on or off"
          />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Toggle feature on or off");
      expect(input).toHaveAttribute("aria-label", "Toggle feature on or off");
    });

    it("should have aria-checked attribute", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema} defaultValues={{ enabled: true }}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).toHaveAttribute("aria-checked", "true");
    });

    it("should have role='switch' on visual element", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const switchElement = container.querySelector('[role="switch"]');
      expect(switchElement).toBeInTheDocument();
    });

    it("should have minimum touch target size", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const switchElement = container.querySelector('[role="switch"]');
      const styles = window.getComputedStyle(switchElement);
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
    });
  });

  describe("Form Integration", () => {
    it("should register with React Hook Form", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", "enabled");
    });

    it("should update form value when toggled", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema} defaultValues={{ enabled: false }}>
          <Switch name="enabled" label="Enable" />
        </FormWrapper>
      );

      const input = screen.getByLabelText("Enable");
      fireEvent.click(input);

      // Form value should be updated
      expect(input).toBeChecked();
    });
  });

  describe("Disabled State", () => {
    it("should have disabled cursor when disabled", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" disabled />
        </FormWrapper>
      );

      const label = container.querySelector("label[for]");
      expect(label).toHaveStyle({ cursor: "not-allowed" });
    });

    it("should have reduced opacity when disabled", () => {
      const schema = yup.object({
        enabled: yup.boolean().optional(),
      });

      const { container } = render(
        <FormWrapper schema={schema}>
          <Switch name="enabled" label="Enable" disabled />
        </FormWrapper>
      );

      const label = container.querySelector("label[for]");
      expect(label).toHaveStyle({ opacity: "0.6" });
    });
  });
});

