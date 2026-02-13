/**
 * FieldEdge Customer Tools
 */

import { z } from 'zod';
import type { FieldEdgeClient } from '../clients/fieldedge.js';

export function registerCustomerTools(client: FieldEdgeClient) {
  return {
    fieldedge_list_customers: {
      description: 'List all customers with optional filters (status, type, search query)',
      parameters: z.object({
        query: z.string().optional().describe('Search query for customer name, email, or phone'),
        status: z.enum(['active', 'inactive']).optional().describe('Filter by customer status'),
        type: z.enum(['residential', 'commercial']).optional().describe('Filter by customer type'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        page: z.number().optional().describe('Page number for pagination'),
        pageSize: z.number().optional().describe('Number of results per page'),
        sortBy: z.enum(['name', 'createdDate', 'balance']).optional().describe('Sort field'),
        sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      }),
      execute: async (args: any) => {
        const customers = await client.getCustomers(args);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(customers, null, 2),
            },
          ],
        };
      },
    },

    fieldedge_get_customer: {
      description: 'Get detailed information about a specific customer by ID',
      parameters: z.object({
        customerId: z.string().describe('The customer ID'),
      }),
      execute: async (args: { customerId: string }) => {
        const customer = await client.getCustomer(args.customerId);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(customer, null, 2),
            },
          ],
        };
      },
    },

    fieldedge_create_customer: {
      description: 'Create a new customer',
      parameters: z.object({
        firstName: z.string().describe('Customer first name'),
        lastName: z.string().describe('Customer last name'),
        companyName: z.string().optional().describe('Company name for commercial customers'),
        email: z.string().optional().describe('Email address'),
        phone: z.string().optional().describe('Primary phone number'),
        mobilePhone: z.string().optional().describe('Mobile phone number'),
        type: z.enum(['residential', 'commercial']).optional().describe('Customer type'),
        address: z.object({
          street1: z.string(),
          street2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.string().optional(),
        }).optional().describe('Customer address'),
        tags: z.array(z.string()).optional().describe('Customer tags'),
        notes: z.string().optional().describe('Notes about the customer'),
      }),
      execute: async (args: any) => {
        const customer = await client.createCustomer(args);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(customer, null, 2),
            },
          ],
        };
      },
    },

    fieldedge_update_customer: {
      description: 'Update an existing customer',
      parameters: z.object({
        customerId: z.string().describe('The customer ID to update'),
        firstName: z.string().optional().describe('Customer first name'),
        lastName: z.string().optional().describe('Customer last name'),
        companyName: z.string().optional().describe('Company name'),
        email: z.string().optional().describe('Email address'),
        phone: z.string().optional().describe('Primary phone number'),
        mobilePhone: z.string().optional().describe('Mobile phone number'),
        status: z.enum(['active', 'inactive']).optional().describe('Customer status'),
        type: z.enum(['residential', 'commercial']).optional().describe('Customer type'),
        address: z.object({
          street1: z.string(),
          street2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.string().optional(),
        }).optional().describe('Customer address'),
        tags: z.array(z.string()).optional().describe('Customer tags'),
        notes: z.string().optional().describe('Notes about the customer'),
      }),
      execute: async (args: any) => {
        const { customerId, ...updateData } = args;
        const customer = await client.updateCustomer(customerId, updateData);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(customer, null, 2),
            },
          ],
        };
      },
    },

    fieldedge_delete_customer: {
      description: 'Delete a customer',
      parameters: z.object({
        customerId: z.string().describe('The customer ID to delete'),
      }),
      execute: async (args: { customerId: string }) => {
        await client.deleteCustomer(args.customerId);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Customer ${args.customerId} deleted successfully`,
            },
          ],
        };
      },
    },

    fieldedge_search_customers: {
      description: 'Search for customers by name, email, phone, or other criteria',
      parameters: z.object({
        query: z.string().describe('Search query'),
      }),
      execute: async (args: { query: string }) => {
        const customers = await client.searchCustomers(args.query);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(customers, null, 2),
            },
          ],
        };
      },
    },
  };
}
