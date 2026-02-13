/**
 * FieldEdge MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { initializeFieldEdgeClient } from './clients/fieldedge.js';

// Import tool definitions and handlers
import { customerTools, handleCustomerTool } from './tools/customers.js';
import { jobTools, handleJobTool } from './tools/jobs.js';
import { invoiceTools, handleInvoiceTool } from './tools/invoices.js';
import { estimateTools, handleEstimateTool } from './tools/estimates.js';
import { equipmentTools, handleEquipmentTool } from './tools/equipment.js';
import { technicianTools, handleTechnicianTool } from './tools/technicians.js';
import { schedulingTools, handleSchedulingTool } from './tools/scheduling.js';
import { inventoryTools, handleInventoryTool } from './tools/inventory.js';
import { paymentTools, handlePaymentTool } from './tools/payments.js';
import { reportingTools, handleReportingTool } from './tools/reporting.js';
import { locationTools, handleLocationTool } from './tools/locations.js';
import { serviceAgreementTools, handleServiceAgreementTool } from './tools/service-agreements.js';
import { taskTools, handleTaskTool } from './tools/tasks.js';

// Combine all tools
const ALL_TOOLS = [
  ...customerTools,
  ...jobTools,
  ...invoiceTools,
  ...estimateTools,
  ...equipmentTools,
  ...technicianTools,
  ...schedulingTools,
  ...inventoryTools,
  ...paymentTools,
  ...reportingTools,
  ...locationTools,
  ...serviceAgreementTools,
  ...taskTools,
];

// Tool handler map
const TOOL_HANDLERS: Record<string, (name: string, args: any) => Promise<any>> = {
  // Customer tools
  ...Object.fromEntries(customerTools.map(t => [t.name, handleCustomerTool])),
  // Job tools
  ...Object.fromEntries(jobTools.map(t => [t.name, handleJobTool])),
  // Invoice tools
  ...Object.fromEntries(invoiceTools.map(t => [t.name, handleInvoiceTool])),
  // Estimate tools
  ...Object.fromEntries(estimateTools.map(t => [t.name, handleEstimateTool])),
  // Equipment tools
  ...Object.fromEntries(equipmentTools.map(t => [t.name, handleEquipmentTool])),
  // Technician tools
  ...Object.fromEntries(technicianTools.map(t => [t.name, handleTechnicianTool])),
  // Scheduling tools
  ...Object.fromEntries(schedulingTools.map(t => [t.name, handleSchedulingTool])),
  // Inventory tools
  ...Object.fromEntries(inventoryTools.map(t => [t.name, handleInventoryTool])),
  // Payment tools
  ...Object.fromEntries(paymentTools.map(t => [t.name, handlePaymentTool])),
  // Reporting tools
  ...Object.fromEntries(reportingTools.map(t => [t.name, handleReportingTool])),
  // Location tools
  ...Object.fromEntries(locationTools.map(t => [t.name, handleLocationTool])),
  // Service agreement tools
  ...Object.fromEntries(serviceAgreementTools.map(t => [t.name, handleServiceAgreementTool])),
  // Task tools
  ...Object.fromEntries(taskTools.map(t => [t.name, handleTaskTool])),
};

export class FieldEdgeServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'fieldedge-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: ALL_TOOLS,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const handler = TOOL_HANDLERS[name];
        if (!handler) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        const result = await handler(name, args || {});

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });

    // List resources (React apps)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'fieldedge://app/dashboard',
            name: 'FieldEdge Dashboard',
            description: 'Main dashboard with key metrics and recent activity',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/customers',
            name: 'Customer Management',
            description: 'Browse and manage customers',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/jobs',
            name: 'Job Management',
            description: 'View and manage jobs/work orders',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/scheduling',
            name: 'Scheduling & Dispatch',
            description: 'Dispatch board and appointment scheduling',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/invoices',
            name: 'Invoice Management',
            description: 'Create and manage invoices',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/estimates',
            name: 'Estimate/Quote Management',
            description: 'Create and manage estimates',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/technicians',
            name: 'Technician Management',
            description: 'Manage technicians and view schedules',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/equipment',
            name: 'Equipment Management',
            description: 'Track customer equipment and service history',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/inventory',
            name: 'Inventory Management',
            description: 'Manage parts and equipment inventory',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/payments',
            name: 'Payment Management',
            description: 'Process payments and view payment history',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/service-agreements',
            name: 'Service Agreements',
            description: 'Manage maintenance contracts and service plans',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/reports',
            name: 'Reports & Analytics',
            description: 'View business reports and analytics',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/tasks',
            name: 'Task Management',
            description: 'Manage follow-ups and to-do items',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/calendar',
            name: 'Calendar View',
            description: 'Calendar view of appointments and jobs',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/map-view',
            name: 'Map View',
            description: 'Map view of jobs and technician locations',
            mimeType: 'text/html',
          },
          {
            uri: 'fieldedge://app/price-book',
            name: 'Price Book Management',
            description: 'Manage pricing for services and parts',
            mimeType: 'text/html',
          },
        ],
      };
    });

    // Read resource (serve React app HTML)
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const appName = uri.replace('fieldedge://app/', '');

      try {
        // In production, this would read from dist/ui/{appName}/index.html
        const htmlPath = `./dist/ui/${appName}/index.html`;
        const fs = await import('fs/promises');
        const html = await fs.readFile(htmlPath, 'utf-8');

        return {
          contents: [
            {
              uri,
              mimeType: 'text/html',
              text: html,
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to load app: ${appName}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('FieldEdge MCP server running on stdio');
  }
}
