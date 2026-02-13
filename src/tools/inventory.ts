/**
 * Inventory Management Tools
 */

import type { InventoryItem, InventoryTransaction } from '../types/index.js';
import { getFieldEdgeClient } from '../clients/fieldedge.js';

export const inventoryTools = [
  {
    name: 'fieldedge_list_inventory',
    description: 'List inventory items',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number' },
        category: { type: 'string' },
        manufacturer: { type: 'string' },
        warehouse: { type: 'string' },
        lowStock: { type: 'boolean', description: 'Show only low stock items' },
        search: { type: 'string' },
      },
    },
  },
  {
    name: 'fieldedge_get_inventory_item',
    description: 'Get specific inventory item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_create_inventory_item',
    description: 'Create new inventory item',
    inputSchema: {
      type: 'object',
      properties: {
        sku: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        manufacturer: { type: 'string' },
        modelNumber: { type: 'string' },
        unitOfMeasure: { type: 'string' },
        costPrice: { type: 'number' },
        sellPrice: { type: 'number' },
        reorderPoint: { type: 'number' },
        reorderQuantity: { type: 'number' },
        warehouse: { type: 'string' },
        binLocation: { type: 'string' },
        taxable: { type: 'boolean' },
      },
      required: ['sku', 'name', 'category', 'unitOfMeasure', 'costPrice', 'sellPrice'],
    },
  },
  {
    name: 'fieldedge_update_inventory_item',
    description: 'Update inventory item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        costPrice: { type: 'number' },
        sellPrice: { type: 'number' },
        reorderPoint: { type: 'number' },
        reorderQuantity: { type: 'number' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fieldedge_adjust_inventory',
    description: 'Adjust inventory quantity',
    inputSchema: {
      type: 'object',
      properties: {
        itemId: { type: 'string' },
        quantity: { type: 'number', description: 'Adjustment quantity (positive or negative)' },
        type: { type: 'string', enum: ['receipt', 'issue', 'adjustment', 'transfer', 'return'] },
        reference: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['itemId', 'quantity', 'type'],
    },
  },
  {
    name: 'fieldedge_get_inventory_transactions',
    description: 'Get inventory transaction history',
    inputSchema: {
      type: 'object',
      properties: {
        itemId: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        type: { type: 'string', enum: ['receipt', 'issue', 'adjustment', 'transfer', 'return'] },
      },
    },
  },
  {
    name: 'fieldedge_get_low_stock_items',
    description: 'Get items below reorder point',
    inputSchema: {
      type: 'object',
      properties: {
        warehouse: { type: 'string' },
      },
    },
  },
];

export async function handleInventoryTool(name: string, args: any): Promise<any> {
  const client = getFieldEdgeClient();

  switch (name) {
    case 'fieldedge_list_inventory':
      return await client.getPaginated<InventoryItem>('/inventory', args);

    case 'fieldedge_get_inventory_item':
      return await client.get<InventoryItem>(`/inventory/${args.id}`);

    case 'fieldedge_create_inventory_item':
      return await client.post<InventoryItem>('/inventory', args);

    case 'fieldedge_update_inventory_item':
      const { id, ...updates } = args;
      return await client.patch<InventoryItem>(`/inventory/${id}`, updates);

    case 'fieldedge_adjust_inventory':
      return await client.post<InventoryTransaction>('/inventory/transactions', args);

    case 'fieldedge_get_inventory_transactions':
      return await client.getPaginated<InventoryTransaction>('/inventory/transactions', args);

    case 'fieldedge_get_low_stock_items':
      return await client.get<InventoryItem[]>('/inventory/low-stock', args);

    default:
      throw new Error(`Unknown inventory tool: ${name}`);
  }
}
