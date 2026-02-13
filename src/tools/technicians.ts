/**
 * Technician Management Tools
 */

import type { Technician, TimeEntry } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const technicianTools = [
  {
    name: 'fieldedge_list_technicians',
    description: 'List all technicians',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        status: { type: 'string', enum: ['active', 'inactive', 'on-leave'] },
        skills: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  {
    name: 'fieldedge_get_technician',
    description: 'Get specific technician by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_technician',
    description: 'Create a new technician',
    inputSchema: {
      type: 'object',
      properties: {
        employeeNumber: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        role: { type: 'string' },
        skills: { type: 'array', items: { type: 'string' } },
        hourlyRate: { type: 'number' },
        overtimeRate: { type: 'number' },
        serviceRadius: { type: 'number' },
      },
      required: ['employeeNumber', 'firstName', 'lastName', 'email', 'phone', 'role'],
    },
  },
  {
    name: 'fieldedge_update_technician',
    description: 'Update technician details',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive', 'on-leave'] },
        email: { type: 'string' },
        phone: { type: 'string' },
        role: { type: 'string' },
        skills: { type: 'array', items: { type: 'string' } },
        hourlyRate: { type: 'number' },
        overtimeRate: { type: 'number' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_technician',
    description: 'Delete a technician',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_technician_schedule',
    description: 'Get technician schedule for a date range',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
      },
      required: ['id', 'startDate', 'endDate'],
    },
  },
  {
    name: 'fieldedge_get_technician_availability',
    description: 'Get technician availability for scheduling',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        date: { type: 'string' },
      },
      required: ['id', 'date'],
    },
  },
  {
    name: 'fieldedge_clock_in_technician',
    description: 'Clock in technician (start time tracking)',
    inputSchema: {
      type: 'object',
      properties: {
        technicianId: { type: 'string' },
        jobId: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['technicianId'],
    },
  },
  {
    name: 'fieldedge_clock_out_technician',
    description: 'Clock out technician (end time tracking)',
    inputSchema: {
      type: 'object',
      properties: {
        timeEntryId: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['timeEntryId'],
    },
  },
];

export async function handleTechnicianTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_technicians':
      return await client.getPaginated<Technician>('/technicians', args);

    case 'fieldedge_get_technician':
      return await client.get<Technician>(`/technicians/${args.id}`);

    case 'fieldedge_create_technician':
      return await client.post<Technician>('/technicians', args);

    case 'fieldedge_update_technician':
      const { id, ...updates } = args;
      return await client.patch<Technician>(`/technicians/${id}`, updates);

    case 'fieldedge_delete_technician':
      return await client.delete(`/technicians/${args.id}`);

    case 'fieldedge_get_technician_schedule':
      return await client.get(`/technicians/${args.id}/schedule`, {
        startDate: args.startDate,
        endDate: args.endDate,
      });

    case 'fieldedge_get_technician_availability':
      return await client.get(`/technicians/${args.id}/availability`, {
        date: args.date,
      });

    case 'fieldedge_clock_in_technician':
      return await client.post<TimeEntry>('/time-entries', {
        technicianId: args.technicianId,
        jobId: args.jobId,
        startTime: new Date().toISOString(),
        type: 'regular',
        billable: true,
        notes: args.notes,
      });

    case 'fieldedge_clock_out_technician':
      return await client.patch<TimeEntry>(`/time-entries/${args.timeEntryId}`, {
        endTime: new Date().toISOString(),
        notes: args.notes,
      });

    default:
      throw new Error(`Unknown technician tool: ${name}`);
  }
}
