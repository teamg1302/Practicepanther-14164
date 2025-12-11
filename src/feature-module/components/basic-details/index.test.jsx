/**
 * Test suite for BasicDetails component.
 * @module feature-module/components/basic-details/index.test
 * 
 * Tests the BasicDetails component including:
 * - Rendering different value types (text, image, badge, custom)
 * - Horizontal and vertical layouts
 * - Responsive behavior
 * - External vs internal image URLs
 * - Accessibility features
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BasicDetails from "./index";
import ImageWithBasePath from "@/core/img/imagewithbasebath";

// Mock ImageWithBasePath component
vi.mock("@/core/img/imagewithbasebath", () => ({
  default: ({ src, alt, ...props }) => (
    <img src={`/base${src}`} alt={alt} data-testid="image-with-base-path" {...props} />
  ),
}));

describe("BasicDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render text type details", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      render(<BasicDetails details={details} />);

      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render multiple details", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
        {
          label: "Email",
          value: "john@example.com",
          type: "text",
        },
      ];

      render(<BasicDetails details={details} />);

      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Email:")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should render empty array without errors", () => {
      render(<BasicDetails details={[]} />);
      expect(screen.queryByText(":")).not.toBeInTheDocument();
    });
  });

  describe("Badge Type", () => {
    it("should render badge with success variant", () => {
      const details = [
        {
          label: "Status",
          value: "Active",
          type: "badge",
          badgeVariant: "success",
        },
      ];

      render(<BasicDetails details={details} />);

      const badge = screen.getByText("Active");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge-success");
    });

    it("should render badge with danger variant", () => {
      const details = [
        {
          label: "Status",
          value: "Inactive",
          type: "badge",
          badgeVariant: "danger",
        },
      ];

      render(<BasicDetails details={details} />);

      const badge = screen.getByText("Inactive");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge-danger");
    });

    it("should render badge with default variant when not specified", () => {
      const details = [
        {
          label: "Status",
          value: "Pending",
          type: "badge",
        },
      ];

      render(<BasicDetails details={details} />);

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge-secondary");
    });
  });

  describe("Image Type", () => {
    it("should render external image URL without base path", () => {
      const details = [
        {
          label: "Profile Photo",
          value: "https://example.com/image.jpg",
          type: "image",
        },
      ];

      render(<BasicDetails details={details} />);

      const image = screen.getByAltText("Profile Photo");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
      expect(image.tagName).toBe("IMG");
    });

    it("should render internal image with ImageWithBasePath", () => {
      const details = [
        {
          label: "Profile Photo",
          value: "/uploads/image.jpg",
          type: "image",
        },
      ];

      render(<BasicDetails details={details} />);

      const image = screen.getByTestId("image-with-base-path");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/base/uploads/image.jpg");
    });

    it("should use custom imageAlt when provided", () => {
      const details = [
        {
          label: "Profile Photo",
          value: "https://example.com/image.jpg",
          type: "image",
          imageAlt: "User Profile Picture",
        },
      ];

      render(<BasicDetails details={details} />);

      const image = screen.getByAltText("User Profile Picture");
      expect(image).toBeInTheDocument();
    });

    it("should apply image styles correctly", () => {
      const details = [
        {
          label: "Profile Photo",
          value: "https://example.com/image.jpg",
          type: "image",
        },
      ];

      render(<BasicDetails details={details} />);

      const image = screen.getByAltText("Profile Photo");
      expect(image).toHaveStyle({
        maxWidth: "150px",
        maxHeight: "150px",
        borderRadius: "4px",
      });
    });
  });

  describe("Custom Type", () => {
    it("should render custom component", () => {
      const CustomComponent = () => <div data-testid="custom-component">Custom Content</div>;
      
      const details = [
        {
          label: "Custom Field",
          value: "test",
          type: "custom",
          customComponent: <CustomComponent />,
        },
      ];

      render(<BasicDetails details={details} />);

      expect(screen.getByTestId("custom-component")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should render horizontal layout by default", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(<BasicDetails details={details} />);
      const detailItem = container.querySelector(".d-flex.flex-column.flex-md-row");
      expect(detailItem).toBeInTheDocument();
    });

    it("should render vertical layout when specified", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(
        <BasicDetails details={details} layout="vertical" />
      );
      const detailItem = container.querySelector(".d-flex.flex-column");
      expect(detailItem).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive classes for mobile", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(<BasicDetails details={details} />);
      const labelDiv = container.querySelector(".mb-2.mb-md-0");
      expect(labelDiv).toBeInTheDocument();
    });

    it("should apply responsive width classes", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(<BasicDetails details={details} />);
      const valueDiv = container.querySelector(".w-100.w-md-auto");
      expect(valueDiv).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing label", () => {
      const details = [
        {
          value: "Value Only",
          type: "text",
        },
      ];

      render(<BasicDetails details={details} />);
      expect(screen.getByText("Value Only")).toBeInTheDocument();
    });

    it("should handle long label text", () => {
      const details = [
        {
          label: "This is a very long label that should wrap properly",
          value: "Value",
          type: "text",
        },
      ];

      const { container } = render(<BasicDetails details={details} />);
      const labelDiv = container.querySelector('[style*="wordBreak"]');
      expect(labelDiv).toBeInTheDocument();
    });

    it("should handle null or undefined values gracefully", () => {
      const details = [
        {
          label: "Name",
          value: null,
          type: "text",
        },
      ];

      render(<BasicDetails details={details} />);
      expect(screen.getByText("Name:")).toBeInTheDocument();
    });
  });

  describe("Custom Classes", () => {
    it("should apply custom label class", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(
        <BasicDetails details={details} labelClass="custom-label" />
      );
      const label = container.querySelector(".custom-label");
      expect(label).toBeInTheDocument();
    });

    it("should apply custom value class", () => {
      const details = [
        {
          label: "Name",
          value: "John Doe",
          type: "text",
        },
      ];

      const { container } = render(
        <BasicDetails details={details} valueClass="custom-value" />
      );
      const value = container.querySelector(".custom-value");
      expect(value).toBeInTheDocument();
    });
  });
});

