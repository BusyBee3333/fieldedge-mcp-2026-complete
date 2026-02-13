/**
 * Reporting and Analytics Tools
 */

import type { Report, RevenueReport, TechnicianProductivityReport } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const reportingTools = [
  {
    name: 'fieldedge_get_revenue_report',
    description: 'Get revenue report for a period',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        groupBy: { type: 'string', enum: ['day', 'week', 'month'], default: 'day' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_technician_productivity_report',
    description: 'Get technician productivity metrics',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        technicianIds: { type: 'array', items: { type: 'string' } },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_job_completion_report',
    description: 'Get job completion statistics',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        jobType: { type: 'string' },
        status: { type: 'string' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_aging_receivables_report',
    description: 'Get accounts receivable aging report',
    inputSchema: {
      type: 'object',
      properties: {
        asOfDate: { type: 'string', description: 'As of date (YYYY-MM-DD)' },
        customerId: { type: 'string' },
      },
    },
  },
  {
    name: 'fieldedge_get_sales_by_category_report',
    description: 'Get sales breakdown by category',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_equipment_maintenance_report',
    description: 'Get equipment maintenance history and upcoming',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        equipmentType: { type: 'string' },
        overdueOnly: { type: 'boolean' },
      },
    },
  },
  {
    name: 'fieldedge_get_customer_satisfaction_report',
    description: 'Get customer satisfaction metrics',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_inventory_valuation_report',
    description: 'Get current inventory valuation',
    inputSchema: {
      type: 'object',
      properties: {
        warehouse: { type: 'string' },
        category: { type: 'string' },
      },
    },
  },
];

export async function handleReportingTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_get_revenue_report':
      return await client.get<RevenueReport>('/reports/revenue', args);

    case 'fieldedge_get_technician_productivity_report':
      return await client.get<TechnicianProductivityReport>('/reports/technician-productivity', args);

    case 'fieldedge_get_job_completion_report':
      return await client.get('/reports/job-completion', args);

    case 'fieldedge_get_aging_receivables_report':
      return await client.get('/reports/aging-receivables', args);

    case 'fieldedge_get_sales_by_category_report':
      return await client.get('/reports/sales-by-category', args);

    case 'fieldedge_get_equipment_maintenance_report':
      return await client.get('/reports/equipment-maintenance', args);

    case 'fieldedge_get_customer_satisfaction_report':
      return await client.get('/reports/customer-satisfaction', args);

    case 'fieldedge_get_inventory_valuation_report':
      return await client.get('/reports/inventory-valuation', args);

    default:
      throw new Error(`Unknown reporting tool: ${name}`);
  }
}
