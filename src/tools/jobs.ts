/**
 * Job Management Tools
 */

import { z } from 'zod';
import type { Job, JobStatus } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

// Tool Definitions
export const jobTools = [
  {
    name: 'fieldedge_list_jobs',
    description: 'List all jobs with optional filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        pageSize: { type: 'number', description: 'Items per page' },
        status: { 
          type: 'string', 
          enum: ['scheduled', 'dispatched', 'in-progress', 'on-hold', 'completed', 'cancelled', 'invoiced'],
          description: 'Filter by status' 
        },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'emergency'] },
        customerId: { type: 'string', description: 'Filter by customer ID' },
        technicianId: { type: 'string', description: 'Filter by technician ID' },
        startDate: { type: 'string', description: 'Filter jobs starting from this date' },
        endDate: { type: 'string', description: 'Filter jobs ending before this date' },
        sortBy: { type: 'string' },
        sortOrder: { type: 'string', enum: ['asc', 'desc'] },
      },
    },
  },
  {
    name: 'fieldedge_get_job',
    description: 'Get a specific job by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_job',
    description: 'Create a new job/work order',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Customer ID' },
        locationId: { type: 'string', description: 'Service location ID' },
        jobType: { type: 'string', description: 'Type of job' },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'emergency'], default: 'normal' },
        description: { type: 'string', description: 'Job description' },
        scheduledStart: { type: 'string', description: 'Scheduled start date/time (ISO 8601)' },
        scheduledEnd: { type: 'string', description: 'Scheduled end date/time (ISO 8601)' },
        assignedTechnicians: { type: 'array', items: { type: 'string' }, description: 'Technician IDs' },
        equipmentIds: { type: 'array', items: { type: 'string' }, description: 'Equipment IDs' },
        tags: { type: 'array', items: { type: 'string' } },
        customFields: { type: 'object' },
      },
      required: ['customerId', 'jobType', 'description'],
    },
  },
  {
    name: 'fieldedge_update_job',
    description: 'Update an existing job',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        jobType: { type: 'string' },
        status: { type: 'string', enum: ['scheduled', 'dispatched', 'in-progress', 'on-hold', 'completed', 'cancelled', 'invoiced'] },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'emergency'] },
        description: { type: 'string' },
        scheduledStart: { type: 'string' },
        scheduledEnd: { type: 'string' },
        actualStart: { type: 'string' },
        actualEnd: { type: 'string' },
        assignedTechnicians: { type: 'array', items: { type: 'string' } },
        equipmentIds: { type: 'array', items: { type: 'string' } },
        tags: { type: 'array', items: { type: 'string' } },
        customFields: { type: 'object' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_job',
    description: 'Delete a job',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_start_job',
    description: 'Start a job (set status to in-progress and record actual start time)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        notes: { type: 'string', description: 'Notes about starting the job' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_complete_job',
    description: 'Complete a job (set status to completed and record actual end time)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        notes: { type: 'string', description: 'Completion notes' },
        createInvoice: { type: 'boolean', default: false, description: 'Automatically create invoice' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_cancel_job',
    description: 'Cancel a job',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        reason: { type: 'string', description: 'Cancellation reason' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_assign_technician',
    description: 'Assign or reassign technicians to a job',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        technicianIds: { type: 'array', items: { type: 'string' }, description: 'Technician IDs to assign' },
        replace: { type: 'boolean', default: false, description: 'Replace existing technicians or add to them' },
      },
      required: ['id', 'technicianIds'],
    },
  },
];

// Tool Handlers
export async function handleJobTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_jobs':
      return await client.getPaginated<Job>('/jobs', args);

    case 'fieldedge_get_job':
      return await client.get<Job>(`/jobs/${args.id}`);

    case 'fieldedge_create_job':
      return await client.post<Job>('/jobs', args);

    case 'fieldedge_update_job':
      const { id, ...updates } = args;
      return await client.patch<Job>(`/jobs/${id}`, updates);

    case 'fieldedge_delete_job':
      return await client.delete(`/jobs/${args.id}`);

    case 'fieldedge_start_job':
      return await client.post<Job>(`/jobs/${args.id}/start`, {
        actualStart: new Date().toISOString(),
        notes: args.notes,
      });

    case 'fieldedge_complete_job':
      return await client.post<Job>(`/jobs/${args.id}/complete`, {
        actualEnd: new Date().toISOString(),
        notes: args.notes,
        createInvoice: args.createInvoice,
      });

    case 'fieldedge_cancel_job':
      return await client.post<Job>(`/jobs/${args.id}/cancel`, {
        reason: args.reason,
      });

    case 'fieldedge_assign_technician':
      return await client.post<Job>(`/jobs/${args.id}/assign`, {
        technicianIds: args.technicianIds,
        replace: args.replace,
      });

    default:
      throw new Error(`Unknown job tool: ${name}`);
  }
}
