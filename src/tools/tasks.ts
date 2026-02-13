/**
 * Task Management Tools
 */

import type { Task } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const taskTools = [
  {
    name: 'fieldedge_list_tasks',
    description: 'List tasks',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'] },
        assignedTo: { type: 'string' },
        customerId: { type: 'string' },
        jobId: { type: 'string' },
        dueDate: { type: 'string' },
      },
    },
  },
  {
    name: 'fieldedge_get_task',
    description: 'Get specific task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_task',
    description: 'Create new task',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['call', 'email', 'follow-up', 'inspection', 'other'] },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
        dueDate: { type: 'string' },
        assignedTo: { type: 'string' },
        customerId: { type: 'string' },
        jobId: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['title', 'description', 'type'],
    },
  },
  {
    name: 'fieldedge_update_task',
    description: 'Update task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'] },
        dueDate: { type: 'string' },
        assignedTo: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_complete_task',
    description: 'Mark task as completed',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
];

export async function handleTaskTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_tasks':
      return await client.getPaginated<Task>('/tasks', args);

    case 'fieldedge_get_task':
      return await client.get<Task>(`/tasks/${args.id}`);

    case 'fieldedge_create_task':
      return await client.post<Task>('/tasks', args);

    case 'fieldedge_update_task':
      const { id, ...updates } = args;
      return await client.patch<Task>(`/tasks/${id}`, updates);

    case 'fieldedge_complete_task':
      return await client.patch<Task>(`/tasks/${args.id}`, {
        status: 'completed',
        completedDate: new Date().toISOString(),
        notes: args.notes,
      });

    case 'fieldedge_delete_task':
      return await client.delete(`/tasks/${args.id}`);

    default:
      throw new Error(`Unknown task tool: ${name}`);
  }
}
