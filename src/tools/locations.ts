/**
 * Location Management Tools
 */

import type { Location } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const locationTools = [
  {
    name: 'fieldedge_list_locations',
    description: 'List customer locations',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        type: { type: 'string', enum: ['primary', 'secondary', 'billing', 'service'] },
      },
    },
  },
  {
    name: 'fieldedge_get_location',
    description: 'Get specific location',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_location',
    description: 'Create new location for customer',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string', enum: ['primary', 'secondary', 'billing', 'service'] },
        address: {
          type: 'object',
          properties: {
            street1: { type: 'string' },
            street2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zip: { type: 'string' },
          },
        },
        contactName: { type: 'string' },
        contactPhone: { type: 'string' },
        accessNotes: { type: 'string' },
        gateCode: { type: 'string' },
      },
      required: ['customerId', 'name', 'type', 'address'],
    },
  },
  {
    name: 'fieldedge_update_location',
    description: 'Update location details',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        contactName: { type: 'string' },
        contactPhone: { type: 'string' },
        accessNotes: { type: 'string' },
        gateCode: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_location',
    description: 'Delete a location',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
];

export async function handleLocationTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_locations':
      return await client.getPaginated<Location>('/locations', args);

    case 'fieldedge_get_location':
      return await client.get<Location>(`/locations/${args.id}`);

    case 'fieldedge_create_location':
      return await client.post<Location>('/locations', args);

    case 'fieldedge_update_location':
      const { id, ...updates } = args;
      return await client.patch<Location>(`/locations/${id}`, updates);

    case 'fieldedge_delete_location':
      return await client.delete(`/locations/${args.id}`);

    default:
      throw new Error(`Unknown location tool: ${name}`);
  }
}
