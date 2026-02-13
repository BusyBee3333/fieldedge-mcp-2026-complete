/**
 * Estimate/Quote Management Tools
 */

import type { Estimate, EstimateStatus } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const estimateTools = [
  {
    name: 'fieldedge_list_estimates',
    description: 'List all estimates with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        status: { type: 'string', enum: ['draft', 'sent', 'viewed', 'approved', 'declined', 'expired'] },
        customerId: { type: 'string' },
        sortBy: { type: 'string' },
        sortOrder: { type: 'string', enum: ['asc', 'desc'] },
      },
    },
  },
  {
    name: 'fieldedge_get_estimate',
    description: 'Get a specific estimate by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Estimate ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_estimate',
    description: 'Create a new estimate/quote',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        issueDate: { type: 'string' },
        expiryDate: { type: 'string' },
        lineItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['service', 'part', 'equipment', 'labor'] },
              description: { type: 'string' },
              quantity: { type: 'number' },
              unitPrice: { type: 'number' },
              discount: { type: 'number' },
              tax: { type: 'number' },
            },
          },
        },
        notes: { type: 'string' },
      },
      required: ['customerId', 'issueDate', 'expiryDate', 'lineItems'],
    },
  },
  {
    name: 'fieldedge_update_estimate',
    description: 'Update an existing estimate',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'sent', 'viewed', 'approved', 'declined', 'expired'] },
        expiryDate: { type: 'string' },
        lineItems: { type: 'array' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_estimate',
    description: 'Delete an estimate',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_send_estimate',
    description: 'Send estimate to customer via email',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        subject: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_approve_estimate',
    description: 'Mark estimate as approved and optionally create a job',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        createJob: { type: 'boolean', default: true },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_convert_estimate_to_invoice',
    description: 'Convert an approved estimate to an invoice',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        issueDate: { type: 'string' },
        dueDate: { type: 'string' },
      },
      required: ['id'],
    },
  },
];

export async function handleEstimateTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_estimates':
      return await client.getPaginated<Estimate>('/estimates', args);

    case 'fieldedge_get_estimate':
      return await client.get<Estimate>(`/estimates/${args.id}`);

    case 'fieldedge_create_estimate':
      return await client.post<Estimate>('/estimates', args);

    case 'fieldedge_update_estimate':
      const { id, ...updates } = args;
      return await client.patch<Estimate>(`/estimates/${id}`, updates);

    case 'fieldedge_delete_estimate':
      return await client.delete(`/estimates/${args.id}`);

    case 'fieldedge_send_estimate':
      return await client.post(`/estimates/${args.id}/send`, {
        email: args.email,
        subject: args.subject,
        message: args.message,
      });

    case 'fieldedge_approve_estimate':
      return await client.post(`/estimates/${args.id}/approve`, {
        createJob: args.createJob,
        notes: args.notes,
      });

    case 'fieldedge_convert_estimate_to_invoice':
      return await client.post(`/estimates/${args.id}/convert-to-invoice`, {
        issueDate: args.issueDate,
        dueDate: args.dueDate,
      });

    default:
      throw new Error(`Unknown estimate tool: ${name}`);
  }
}
