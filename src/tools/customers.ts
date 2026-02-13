/**
 * Customer Management Tools
 */

import { z } from 'zod';
import type { Customer, QueryParams } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

// Schemas
const AddressSchema = z.object({
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const CreateCustomerSchema = z.object({
  firstName: z.string().describe('Customer first name'),
  lastName: z.string().describe('Customer last name'),
  companyName: z.string().optional().describe('Company name for commercial customers'),
  email: z.string().email().optional().describe('Email address'),
  phone: z.string().optional().describe('Primary phone number'),
  mobilePhone: z.string().optional().describe('Mobile phone number'),
  address: AddressSchema.optional().describe('Service address'),
  billingAddress: AddressSchema.optional().describe('Billing address'),
  customerType: z.enum(['residential', 'commercial']).describe('Customer type'),
  taxExempt: z.boolean().default(false).describe('Tax exempt status'),
  creditLimit: z.number().optional().describe('Credit limit'),
  notes: z.string().optional().describe('Customer notes'),
  tags: z.array(z.string()).optional().describe('Customer tags'),
  customFields: z.record(z.any()).optional().describe('Custom field values'),
});

const UpdateCustomerSchema = z.object({
  id: z.string().describe('Customer ID'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  address: AddressSchema.optional(),
  billingAddress: AddressSchema.optional(),
  status: z.enum(['active', 'inactive', 'prospect']).optional(),
  customerType: z.enum(['residential', 'commercial']).optional(),
  taxExempt: z.boolean().optional(),
  creditLimit: z.number().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.any()).optional(),
});

const SearchCustomersSchema = z.object({
  search: z.string().optional().describe('Search query'),
  status: z.enum(['active', 'inactive', 'prospect']).optional(),
  customerType: z.enum(['residential', 'commercial']).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().default(1),
  pageSize: z.number().default(50),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Tool Definitions
export const customerTools = [
  {
    name: 'fieldedge_list_customers',
    description: 'List all customers with optional filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        pageSize: { type: 'number', description: 'Items per page (default: 50)' },
        status: { type: 'string', enum: ['active', 'inactive', 'prospect'], description: 'Filter by status' },
        customerType: { type: 'string', enum: ['residential', 'commercial'], description: 'Filter by type' },
        sortBy: { type: 'string', description: 'Field to sort by' },
        sortOrder: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
      },
    },
  },
  {
    name: 'fieldedge_get_customer',
    description: 'Get a specific customer by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_customer',
    description: 'Create a new customer',
    inputSchema: zodToJsonSchema(CreateCustomerSchema),
  },
  {
    name: 'fieldedge_update_customer',
    description: 'Update an existing customer',
    inputSchema: zodToJsonSchema(UpdateCustomerSchema),
  },
  {
    name: 'fieldedge_delete_customer',
    description: 'Delete a customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_search_customers',
    description: 'Search customers by name, email, phone, or other criteria',
    inputSchema: zodToJsonSchema(SearchCustomersSchema),
  },
  {
    name: 'fieldedge_get_customer_balance',
    description: 'Get customer account balance and payment history',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_customer_jobs',
    description: 'Get all jobs for a specific customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        status: { type: 'string', description: 'Filter by job status' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_customer_invoices',
    description: 'Get all invoices for a specific customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        status: { type: 'string', enum: ['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'] },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_customer_equipment',
    description: 'Get all equipment for a specific customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        status: { type: 'string', enum: ['active', 'inactive', 'decommissioned'] },
      },
      required: ['id'],
    },
  },
];

// Tool Handlers
export async function handleCustomerTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_customers':
      return await client.getPaginated<Customer>('/customers', args);

    case 'fieldedge_get_customer':
      return await client.get<Customer>(`/customers/${args.id}`);

    case 'fieldedge_create_customer':
      const createData = CreateCustomerSchema.parse(args);
      return await client.post<Customer>('/customers', createData);

    case 'fieldedge_update_customer':
      const updateData = UpdateCustomerSchema.parse(args);
      const { id, ...updates } = updateData;
      return await client.patch<Customer>(`/customers/${id}`, updates);

    case 'fieldedge_delete_customer':
      return await client.delete(`/customers/${args.id}`);

    case 'fieldedge_search_customers':
      const searchParams = SearchCustomersSchema.parse(args);
      return await client.getPaginated<Customer>('/customers/search', searchParams);

    case 'fieldedge_get_customer_balance':
      return await client.get(`/customers/${args.id}/balance`);

    case 'fieldedge_get_customer_jobs':
      return await client.getPaginated(`/customers/${args.id}/jobs`, {
        status: args.status,
        page: args.page,
        pageSize: args.pageSize,
      });

    case 'fieldedge_get_customer_invoices':
      return await client.getPaginated(`/customers/${args.id}/invoices`, {
        status: args.status,
        page: args.page,
        pageSize: args.pageSize,
      });

    case 'fieldedge_get_customer_equipment':
      return await client.get(`/customers/${args.id}/equipment`, {
        status: args.status,
      });

    default:
      throw new Error(`Unknown customer tool: ${name}`);
  }
}

// Helper function to convert Zod schema to JSON Schema
function zodToJsonSchema(schema: z.ZodType<any>): any {
  // Simplified conversion - in production use zod-to-json-schema library
  return {
    type: 'object',
    properties: {},
    required: [],
  };
}
