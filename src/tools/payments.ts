/**
 * Payment Management Tools
 */

import type { Payment } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const paymentTools = [
  {
    name: 'fieldedge_list_payments',
    description: 'List all payments',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        customerId: { type: 'string' },
        invoiceId: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'processed', 'failed', 'refunded'] },
        paymentMethod: { type: 'string', enum: ['cash', 'check', 'credit-card', 'debit-card', 'ach', 'wire', 'other'] },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
      },
    },
  },
  {
    name: 'fieldedge_get_payment',
    description: 'Get specific payment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_process_payment',
    description: 'Process a new payment',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        paymentMethod: { type: 'string', enum: ['cash', 'check', 'credit-card', 'debit-card', 'ach', 'wire', 'other'] },
        paymentDate: { type: 'string' },
        reference: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['invoiceId', 'customerId', 'amount', 'paymentMethod'],
    },
  },
  {
    name: 'fieldedge_refund_payment',
    description: 'Refund a payment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        amount: { type: 'number' },
        reason: { type: 'string' },
      },
      required: ['id', 'amount', 'reason'],
    },
  },
  {
    name: 'fieldedge_void_payment',
    description: 'Void a payment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['id', 'reason'],
    },
  },
];

export async function handlePaymentTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_payments':
      return await client.getPaginated<Payment>('/payments', args);

    case 'fieldedge_get_payment':
      return await client.get<Payment>(`/payments/${args.id}`);

    case 'fieldedge_process_payment':
      return await client.post<Payment>('/payments', args);

    case 'fieldedge_refund_payment':
      return await client.post<Payment>(`/payments/${args.id}/refund`, {
        amount: args.amount,
        reason: args.reason,
      });

    case 'fieldedge_void_payment':
      return await client.post(`/payments/${args.id}/void`, {
        reason: args.reason,
      });

    default:
      throw new Error(`Unknown payment tool: ${name}`);
  }
}
