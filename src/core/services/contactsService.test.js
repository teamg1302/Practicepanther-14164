/**
 * Test suite for contacts service.
 * @module core/services/contactsService.test
 * 
 * Tests all contact-related API service functions including:
 * - getContacts
 * - createContact
 * - getContactById
 * - updateContact
 * - deleteContact
 * - getMattersByContactId
 * - getActivitiesLogByContactId
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as contactsService from "./contactsService";
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

describe("Contacts Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getContacts", () => {
    it("should fetch contacts list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, name: "John Doe" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContacts();

      expect(api.get).toHaveBeenCalledWith("/contacts");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch contacts with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, name: "John Doe" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContacts(params);

      expect(api.get).toHaveBeenCalledWith("/contacts?page=1&limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch contacts with search and sort params", async () => {
      const params = {
        search: "john",
        sortBy: "name",
        order: "asc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, name: "John Doe" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContacts(params);

      expect(api.get).toHaveBeenCalledWith(
        "/contacts?search=john&sortBy=name&order=asc"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch contacts" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(contactsService.getContacts()).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("getContactById", () => {
    it("should fetch contact by id", async () => {
      const contactId = "123";
      const mockResponse = {
        data: {
          data: {
            id: contactId,
            name: "John Doe",
            email: "john@example.com",
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContactById(contactId);

      expect(api.get).toHaveBeenCalledWith(`/contacts/${contactId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle nested response structure", async () => {
      const contactId = "123";
      const mockResponse = {
        data: {
          data: {
            id: contactId,
            name: "John Doe",
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContactById(contactId);

      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle flat response structure", async () => {
      const contactId = "123";
      const mockResponse = {
        data: {
          id: contactId,
          name: "John Doe",
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getContactById(contactId);

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle error response", async () => {
      const contactId = "123";
      const errorResponse = {
        response: {
          data: { message: "Contact not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        contactsService.getContactById(contactId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("getMattersByContactId", () => {
    it("should fetch matters by contact id without query params", async () => {
      const params = { contactId: "123" };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, matterName: "Matter 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getMattersByContactId(params);

      expect(api.get).toHaveBeenCalledWith("/matters/contact/123");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch matters by contact id with pagination", async () => {
      const params = {
        contactId: "123",
        page: 1,
        limit: 10,
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, matterName: "Matter 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getMattersByContactId(params);

      expect(api.get).toHaveBeenCalledWith(
        "/matters/contact/123?page=1&limit=10"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch matters by contact id with search and sort", async () => {
      const params = {
        contactId: "123",
        search: "matter",
        sortBy: "matterName",
        order: "asc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, matterName: "Matter 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getMattersByContactId(params);

      expect(api.get).toHaveBeenCalledWith(
        "/matters/contact/123?search=matter&sortBy=matterName&order=asc"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should throw error when contactId is missing", async () => {
      const params = {};

      await expect(
        contactsService.getMattersByContactId(params)
      ).rejects.toThrow("contactId is required");
    });

    it("should handle error response", async () => {
      const params = { contactId: "123" };
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch matters" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        contactsService.getMattersByContactId(params)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("getActivitiesLogByContactId", () => {
    it("should fetch activities log by contact id without query params", async () => {
      const params = { contactId: "123" };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "CREATE",
                description: "Contact created",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getActivitiesLogByContactId(params);

      expect(api.get).toHaveBeenCalledWith("/contacts/123/activity-log");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch activities log with pagination", async () => {
      const params = {
        contactId: "123",
        page: 1,
        limit: 10,
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "UPDATE",
                description: "Contact updated",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getActivitiesLogByContactId(params);

      expect(api.get).toHaveBeenCalledWith(
        "/contacts/123/activity-log?page=1&limit=10"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch activities log with search and sort", async () => {
      const params = {
        contactId: "123",
        search: "update",
        sortBy: "createdAt",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "UPDATE",
                description: "Contact updated",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await contactsService.getActivitiesLogByContactId(params);

      expect(api.get).toHaveBeenCalledWith(
        "/contacts/123/activity-log?search=update&sortBy=createdAt&order=desc"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should throw error when contactId is missing", async () => {
      const params = {};

      await expect(
        contactsService.getActivitiesLogByContactId(params)
      ).rejects.toThrow("contactId is required");
    });

    it("should handle error response", async () => {
      const params = { contactId: "123" };
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch activities" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        contactsService.getActivitiesLogByContactId(params)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("createContact", () => {
    it("should create a new contact", async () => {
      const contactData = {
        name: "John Doe",
        email: "john@example.com",
      };
      const mockResponse = {
        data: {
          data: {
            id: "123",
            ...contactData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await contactsService.createContact(contactData);

      expect(api.post).toHaveBeenCalledWith("/contacts", contactData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const contactData = { name: "John Doe" };
      const errorResponse = {
        response: {
          data: { message: "Failed to create contact" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        contactsService.createContact(contactData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("updateContact", () => {
    it("should update a contact", async () => {
      const contactId = "123";
      const contactData = { name: "Jane Doe" };
      const mockResponse = {
        data: {
          data: {
            id: contactId,
            ...contactData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await contactsService.updateContact(contactId, contactData);

      expect(api.patch).toHaveBeenCalledWith(
        `/contacts/${contactId}`,
        contactData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const contactId = "123";
      const contactData = { name: "Jane Doe" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update contact" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        contactsService.updateContact(contactId, contactData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteContact", () => {
    it("should delete a contact", async () => {
      const contactId = "123";
      const mockResponse = {
        data: {
          data: {
            id: contactId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await contactsService.deleteContact(contactId);

      expect(api.delete).toHaveBeenCalledWith(`/contacts/${contactId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const contactId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete contact" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(
        contactsService.deleteContact(contactId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });
});

