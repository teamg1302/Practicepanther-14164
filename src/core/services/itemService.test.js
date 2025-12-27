/**
 * Test suite for item service.
 * @module core/services/itemService.test
 *
 * Tests all item-related API service functions including:
 * - getItems
 * - createItem
 * - getItemById
 * - updateItem
 * - deleteItem
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as itemService from "./itemService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("Item Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getItems", () => {
    it("should fetch items list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                _id: "1",
                code: "A119",
                name: "Case Strategy",
                description: "Case strategy development",
                price: 0,
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItems();

      expect(api.get).toHaveBeenCalledWith("/masters/item");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch items with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Item 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItems(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/masters/item");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch items with search and sort params", async () => {
      const params = {
        search: "legal",
        sortBy: "name",
        order: "asc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Legal Item" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItems(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/masters/item");
      expect(callArgs).toContain("search=legal");
      expect(callArgs).toContain("sortBy=name");
      expect(callArgs).toContain("order=asc");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch items with status filter", async () => {
      const params = { status: "active" };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Active Item", isActive: true }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItems(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("status=active");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch items with categoryId filter", async () => {
      const params = { categoryId: "category-123" };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Item 1", categoryId: "category-123" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItems(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("categoryId=category-123");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch items" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(itemService.getItems()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle error without response object", async () => {
      const error = new Error("Network error");

      api.get.mockRejectedValue(error);

      await expect(itemService.getItems()).rejects.toEqual(error.message);
    });
  });

  describe("getItemById", () => {
    it("should fetch item by id", async () => {
      const itemId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: itemId,
            code: "A119",
            name: "Case Strategy",
            description: "Case strategy development",
            price: 0,
            isActive: true,
            tax1Id: {
              _id: "692954dbeebf90d01b4456f2",
              name: "VAT 10%",
              rate: 10,
            },
            tax2Id: {
              _id: "692954dbeebf90d01b4456f2",
              name: "VAT 10%",
              rate: 10,
            },
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await itemService.getItemById(itemId);

      expect(api.get).toHaveBeenCalledWith(`/masters/item/${itemId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const itemId = "123";
      const errorResponse = {
        response: {
          data: { message: "Item not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(itemService.getItemById(itemId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("createItem", () => {
    it("should create a new item", async () => {
      const itemData = {
        code: "A119",
        name: "Case Strategy",
        description: "Case strategy development",
        price: 0,
        isActive: true,
        tax1Id: "692954dbeebf90d01b4456f2",
        tax2Id: "692954dbeebf90d01b4456f2",
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...itemData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await itemService.createItem(itemData);

      expect(api.post).toHaveBeenCalledWith("/masters/item", itemData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create item with minimal data", async () => {
      const itemData = {
        code: "A120",
        name: "Minimal Item",
        price: 100,
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...itemData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await itemService.createItem(itemData);

      expect(api.post).toHaveBeenCalledWith("/masters/item", itemData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const itemData = { name: "New Item", code: "A121", price: 0 };
      const errorResponse = {
        response: {
          data: { message: "Failed to create item" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(itemService.createItem(itemData)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("updateItem", () => {
    it("should update an item", async () => {
      const itemId = "123";
      const itemData = { name: "Updated Item" };
      const mockResponse = {
        data: {
          data: {
            _id: itemId,
            ...itemData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await itemService.updateItem(itemId, itemData);

      expect(api.patch).toHaveBeenCalledWith(
        `/masters/item/${itemId}`,
        itemData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should update item with multiple fields", async () => {
      const itemId = "123";
      const itemData = {
        name: "Updated Item",
        description: "Updated description",
        price: 150,
        isActive: false,
        tax1Id: "692954dbeebf90d01b4456f2",
      };
      const mockResponse = {
        data: {
          data: {
            _id: itemId,
            ...itemData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await itemService.updateItem(itemId, itemData);

      expect(api.patch).toHaveBeenCalledWith(
        `/masters/item/${itemId}`,
        itemData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const itemId = "123";
      const itemData = { name: "Updated Item" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update item" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        itemService.updateItem(itemId, itemData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteItem", () => {
    it("should delete an item", async () => {
      const itemId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: itemId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await itemService.deleteItem(itemId);

      expect(api.delete).toHaveBeenCalledWith(`/masters/item/${itemId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const itemId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete item" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(itemService.deleteItem(itemId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });
});

