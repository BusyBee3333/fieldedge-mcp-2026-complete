/**
 * Invoice Management Tools
 */

import { z } from 'zod';
import type { Invoice, InvoiceStatus, LineItem } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const invoiceTools = [
  {
    name: 'fieldedge_list_invoices',
    description: 'List all invoices with optional filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        status: { type: 'string', enum: ['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'] },
        customerId: { type: 'string', description: 'Filter by customer ID' },
        jobId: { type: 'string', description: 'Filter by job ID' },
        startDate: { type: 'string', description: 'Filter invoices from this date' },
        endDate: { type: 'string', description: 'Filter invoices to this date' },
        sortBy: { type: 'string' },
        sortOrder: { type: 'string', enum: ['asc', 'desc'] },
      },
    },
  },
  {
    name: 'fieldedge_get_invoice',
    description: 'Get a specific invoice by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_invoice',
    description: 'Create a new invoice',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Customer ID' },
        jobId: { type: 'string', description: 'Associated job ID' },
        issueDate: { type: 'string', description: 'Issue date (ISO 8601)' },
        dueDate: { type: 'string', description: 'Due date (ISO 8601)' },
        lineItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['service', 'part', 'equipment', 'labor'] },
              description: { type: 'string' },
              quantity: { type: 'number' },
              unitPrice: { type: 'number' },
              discount: { type: 'number', default: 0 },
              tax: { type: 'number', default: 0 },
              itemId: { type: 'string' },
            },
            required: ['type', 'description', 'quantity', 'unitPrice'],
          },
        },
        paymentTerms: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['customerId', 'issueDate', 'dueDate', 'lineItems'],
    },
  },
  {
    name: 'fieldedge_update_invoice',
    description: 'Update an existing invoice',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
        status: { type: 'string', enum: ['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'] },
        dueDate: { type: 'string' },
        lineItems: { type: 'array' },
        discount: { type: 'number' },
        paymentTerms: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_invoice',
    description: 'Delete an invoice',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_send_invoice',
    description: 'Send invoice to customer via email',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
        email: { type: 'string', description: 'Override customer email' },
        subject: { type: 'string', description: 'Email subject' },
        message: { type: 'string', description: 'Email message' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_void_invoice',
    description: 'Void an invoice',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
        reason: { type: 'string', description: 'Reason for voiding' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_record_payment',
    description: 'Record a payment against an invoice',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string', description: 'Invoice ID' },
        amount: { type: 'number', description: 'Payment amount' },
        paymentMethod: { type: 'string', enum: ['cash', 'check', 'credit-card', 'debit-card', 'ach', 'wire', 'other'] },
        paymentDate: { type: 'string', description: 'Payment date (ISO 8601)' },
        reference: { type: 'string', description: 'Payment reference/confirmation number' },
        notes: { type: 'string' },
      },
      required: ['invoiceId', 'amount', 'paymentMethod'],
    },
  },
  {
    name: 'fieldedge_get_invoice_pdf',
    description: 'Generate and get invoice PDF',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Invoice ID' },
      },
      required: ['id'],
    },
  },
];

export async function handleInvoiceTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_invoices':
      return await client.getPaginated<Invoice>('/invoices', args);

    case 'fieldedge_get_invoice':
      return await client.get<Invoice>(`/invoices/${args.id}`);

    case 'fieldedge_create_invoice':
      return await client.post<Invoice>('/invoices', args);

    case 'fieldedge_update_invoice':
      const { id, ...updates } = args;
      return await client.patch<Invoice>(`/invoices/${id}`, updates);

    case 'fieldedge_delete_invoice':
      return await client.delete(`/invoices/${args.id}`);

    case 'fieldedge_send_invoice':
      return await client.post(`/invoices/${args.id}/send`, {
        email: args.email,
        subject: args.subject,
        message: args.message,
      });

    case 'fieldedge_void_invoice':
      return await client.post(`/invoices/${args.id}/void`, {
        reason: args.reason,
      });

    case 'fieldedge_record_payment':
      return await client.post('/payments', args);

    case 'fieldedge_get_invoice_pdf':
      const pdfData = await client.downloadFile(`/invoices/${args.id}/pdf`);
      return {
        success: true,
        message: 'PDF generated successfully',
        size: pdfData.length,
        data: pdfData.toString('base64'),
      };

    default:
      throw new Error(`Unknown invoice tool: ${name}`);
  }
}
