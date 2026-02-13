/**
 * Scheduling and Dispatch Tools
 */

import type { Appointment, DispatchBoard } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const schedulingTools = [
  {
    name: 'fieldedge_list_appointments',
    description: 'List appointments with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        technicianId: { type: 'string' },
        customerId: { type: 'string' },
        status: { type: 'string', enum: ['scheduled', 'confirmed', 'dispatched', 'en-route', 'arrived', 'completed', 'cancelled', 'no-show'] },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
    },
  },
  {
    name: 'fieldedge_get_appointment',
    description: 'Get specific appointment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_appointment',
    description: 'Create a new appointment',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        customerId: { type: 'string' },
        technicianId: { type: 'string' },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        appointmentType: { type: 'string' },
        arrivalWindow: {
          type: 'object',
          properties: {
            start: { type: 'string' },
            end: { type: 'string' },
          },
        },
        notes: { type: 'string' },
      },
      required: ['jobId', 'customerId', 'technicianId', 'startTime', 'endTime', 'appointmentType'],
    },
  },
  {
    name: 'fieldedge_update_appointment',
    description: 'Update an appointment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        technicianId: { type: 'string' },
        status: { type: 'string', enum: ['scheduled', 'confirmed', 'dispatched', 'en-route', 'arrived', 'completed', 'cancelled', 'no-show'] },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_cancel_appointment',
    description: 'Cancel an appointment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        reason: { type: 'string' },
        notifyCustomer: { type: 'boolean', default: true },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_dispatch_board',
    description: 'Get dispatch board for a specific date',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
        technicianIds: { type: 'array', items: { type: 'string' }, description: 'Filter by specific technicians' },
      },
      required: ['date'],
    },
  },
  {
    name: 'fieldedge_dispatch_job',
    description: 'Dispatch a job to technician',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        technicianId: { type: 'string' },
        scheduledTime: { type: 'string' },
        notifyTechnician: { type: 'boolean', default: true },
      },
      required: ['jobId', 'technicianId', 'scheduledTime'],
    },
  },
  {
    name: 'fieldedge_optimize_routes',
    description: 'Optimize technician routes for a day',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        technicianIds: { type: 'array', items: { type: 'string' } },
      },
      required: ['date'],
    },
  },
];

export async function handleSchedulingTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_appointments':
      return await client.getPaginated<Appointment>('/appointments', args);

    case 'fieldedge_get_appointment':
      return await client.get<Appointment>(`/appointments/${args.id}`);

    case 'fieldedge_create_appointment':
      return await client.post<Appointment>('/appointments', args);

    case 'fieldedge_update_appointment':
      const { id, ...updates } = args;
      return await client.patch<Appointment>(`/appointments/${id}`, updates);

    case 'fieldedge_cancel_appointment':
      return await client.post(`/appointments/${args.id}/cancel`, {
        reason: args.reason,
        notifyCustomer: args.notifyCustomer,
      });

    case 'fieldedge_get_dispatch_board':
      return await client.get<DispatchBoard>('/dispatch/board', {
        date: args.date,
        technicianIds: args.technicianIds,
      });

    case 'fieldedge_dispatch_job':
      return await client.post('/dispatch', {
        jobId: args.jobId,
        technicianId: args.technicianId,
        scheduledTime: args.scheduledTime,
        notifyTechnician: args.notifyTechnician,
      });

    case 'fieldedge_optimize_routes':
      return await client.post('/dispatch/optimize-routes', {
        date: args.date,
        technicianIds: args.technicianIds,
      });

    default:
      throw new Error(`Unknown scheduling tool: ${name}`);
  }
}
