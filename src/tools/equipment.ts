/**
 * Equipment Management Tools
 */

import type { Equipment, ServiceHistory } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const equipmentTools = [
  {
    name: 'fieldedge_list_equipment',
    description: 'List all equipment with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        customerId: { type: 'string' },
        locationId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive', 'decommissioned'] },
        type: { type: 'string' },
        manufacturer: { type: 'string' },
      },
    },
  },
  {
    name: 'fieldedge_get_equipment',
    description: 'Get specific equipment by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_equipment',
    description: 'Create a new equipment record',
    inputSchema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        locationId: { type: 'string' },
        type: { type: 'string' },
        manufacturer: { type: 'string' },
        model: { type: 'string' },
        serialNumber: { type: 'string' },
        installDate: { type: 'string' },
        warrantyExpiry: { type: 'string' },
        notes: { type: 'string' },
        customFields: { type: 'object' },
      },
      required: ['customerId', 'type', 'manufacturer', 'model'],
    },
  },
  {
    name: 'fieldedge_update_equipment',
    description: 'Update equipment record',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive', 'decommissioned'] },
        type: { type: 'string' },
        manufacturer: { type: 'string' },
        model: { type: 'string' },
        serialNumber: { type: 'string' },
        installDate: { type: 'string' },
        warrantyExpiry: { type: 'string' },
        lastServiceDate: { type: 'string' },
        nextServiceDue: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_equipment',
    description: 'Delete equipment record',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_get_equipment_service_history',
    description: 'Get service history for equipment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_schedule_equipment_maintenance',
    description: 'Schedule preventive maintenance for equipment',
    inputSchema: {
      type: 'object',
      properties: {
        equipmentId: { type: 'string' },
        scheduledDate: { type: 'string' },
        technicianId: { type: 'string' },
        maintenanceType: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['equipmentId', 'scheduledDate', 'maintenanceType'],
    },
  },
];

export async function handleEquipmentTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_equipment':
      return await client.getPaginated<Equipment>('/equipment', args);

    case 'fieldedge_get_equipment':
      return await client.get<Equipment>(`/equipment/${args.id}`);

    case 'fieldedge_create_equipment':
      return await client.post<Equipment>('/equipment', args);

    case 'fieldedge_update_equipment':
      const { id, ...updates } = args;
      return await client.patch<Equipment>(`/equipment/${id}`, updates);

    case 'fieldedge_delete_equipment':
      return await client.delete(`/equipment/${args.id}`);

    case 'fieldedge_get_equipment_service_history':
      return await client.get<ServiceHistory[]>(`/equipment/${args.id}/service-history`, {
        startDate: args.startDate,
        endDate: args.endDate,
      });

    case 'fieldedge_schedule_equipment_maintenance':
      return await client.post('/jobs', {
        customerId: args.customerId,
        equipmentIds: [args.equipmentId],
        jobType: 'maintenance',
        description: args.maintenanceType,
        scheduledStart: args.scheduledDate,
        assignedTechnicians: args.technicianId ? [args.technicianId] : [],
        notes: args.notes,
      });

    default:
      throw new Error(`Unknown equipment tool: ${name}`);
  }
}
