/**
 * Service Agreement Management Tools
 */

import type { ServiceAgreement } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const serviceAgreementTools = [
  {
    name: 'fieldedge_list_service_agreements',
    description: 'List service agreements',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
        type: { type: 'string', enum: ['maintenance', 'warranty', 'service-plan'] },
      },
    },
  },
  {
    name: 'fieldedge_get_service_agreement',
    description: 'Get specific service agreement',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_service_agreement',
    description: 'Create new service agreement',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string', enum: ['maintenance', 'warranty', 'service-plan'] },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        billingCycle: { type: 'string', enum: ['monthly', 'quarterly', 'annual'] },
        amount: { type: 'number' },
        autoRenew: { type: 'boolean', default: false },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              frequency: { type: 'string', enum: ['weekly', 'monthly', 'quarterly', 'semi-annual', 'annual'] },
            },
          },
        },
        equipmentIds: { type: 'array', items: { type: 'string' } },
        notes: { type: 'string' },
      },
      required: ['customerId', 'name', 'type', 'startDate', 'endDate', 'billingCycle', 'amount'],
    },
  },
  {
    name: 'fieldedge_update_service_agreement',
    description: 'Update service agreement',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
        endDate: { type: 'string' },
        amount: { type: 'number' },
        autoRenew: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_cancel_service_agreement',
    description: 'Cancel a service agreement',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        reason: { type: 'string' },
        effectiveDate: { type: 'string' },
      },
      required: ['id', 'reason'],
    },
  },
  {
    name: 'fieldedge_renew_service_agreement',
    description: 'Renew an expiring service agreement',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        newEndDate: { type: 'string' },
        newAmount: { type: 'number' },
      },
      required: ['id', 'newEndDate'],
    },
  },
];

export async function handleServiceAgreementTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_service_agreements':
      return await client.getPaginated<ServiceAgreement>('/service-agreements', args);

    case 'fieldedge_get_service_agreement':
      return await client.get<ServiceAgreement>(`/service-agreements/${args.id}`);

    case 'fieldedge_create_service_agreement':
      return await client.post<ServiceAgreement>('/service-agreements', args);

    case 'fieldedge_update_service_agreement':
      const { id, ...updates } = args;
      return await client.patch<ServiceAgreement>(`/service-agreements/${id}`, updates);

    case 'fieldedge_cancel_service_agreement':
      return await client.post(`/service-agreements/${args.id}/cancel`, {
        reason: args.reason,
        effectiveDate: args.effectiveDate,
      });

    case 'fieldedge_renew_service_agreement':
      return await client.post(`/service-agreements/${args.id}/renew`, {
        newEndDate: args.newEndDate,
        newAmount: args.newAmount,
      });

    default:
      throw new Error(`Unknown service agreement tool: ${name}`);
  }
}
