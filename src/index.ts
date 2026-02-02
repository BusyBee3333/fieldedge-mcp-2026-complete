#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "fieldedge";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.fieldedge.com/v1";

// ============================================
// API CLIENT
// ============================================
class FieldEdgeClient {
  private apiKey: string;
  private subscriptionKey: string;
  private baseUrl: string;

  constructor(apiKey: string, subscriptionKey?: string) {
    this.apiKey = apiKey;
    this.subscriptionKey = subscriptionKey || apiKey;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Ocp-Apim-Subscription-Key": this.subscriptionKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FieldEdge API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Work Orders
  async listWorkOrders(params: { 
    page?: number; 
    pageSize?: number; 
    status?: string; 
    customerId?: string;
    technicianId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.status) query.append("status", params.status);
    if (params.customerId) query.append("customerId", params.customerId);
    if (params.technicianId) query.append("technicianId", params.technicianId);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    return this.get(`/work-orders?${query.toString()}`);
  }

  async getWorkOrder(id: string) {
    return this.get(`/work-orders/${id}`);
  }

  async createWorkOrder(data: {
    customerId: string;
    locationId?: string;
    description: string;
    workType?: string;
    priority?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    technicianId?: string;
    equipmentIds?: string[];
    notes?: string;
  }) {
    return this.post("/work-orders", data);
  }

  // Customers
  async listCustomers(params: { 
    page?: number; 
    pageSize?: number; 
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.search) query.append("search", params.search);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);
    return this.get(`/customers?${query.toString()}`);
  }

  // Technicians
  async listTechnicians(params: { 
    page?: number; 
    pageSize?: number; 
    active?: boolean;
    departmentId?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.active !== undefined) query.append("active", params.active.toString());
    if (params.departmentId) query.append("departmentId", params.departmentId);
    return this.get(`/technicians?${query.toString()}`);
  }

  // Invoices
  async listInvoices(params: { 
    page?: number; 
    pageSize?: number; 
    status?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.status) query.append("status", params.status);
    if (params.customerId) query.append("customerId", params.customerId);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    return this.get(`/invoices?${query.toString()}`);
  }

  // Equipment
  async listEquipment(params: { 
    page?: number; 
    pageSize?: number; 
    customerId?: string;
    locationId?: string;
    equipmentType?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.customerId) query.append("customerId", params.customerId);
    if (params.locationId) query.append("locationId", params.locationId);
    if (params.equipmentType) query.append("equipmentType", params.equipmentType);
    return this.get(`/equipment?${query.toString()}`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_work_orders",
    description: "List work orders from FieldEdge. Filter by status, customer, technician, and date range.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination (default: 1)" },
        pageSize: { type: "number", description: "Number of results per page (default: 25, max: 100)" },
        status: { 
          type: "string", 
          description: "Filter by work order status",
          enum: ["open", "scheduled", "in_progress", "completed", "canceled", "on_hold"]
        },
        customerId: { type: "string", description: "Filter work orders by customer ID" },
        technicianId: { type: "string", description: "Filter work orders by assigned technician ID" },
        startDate: { type: "string", description: "Filter by scheduled date (start) in YYYY-MM-DD format" },
        endDate: { type: "string", description: "Filter by scheduled date (end) in YYYY-MM-DD format" },
      },
    },
  },
  {
    name: "get_work_order",
    description: "Get detailed information about a specific work order by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "The work order ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_work_order",
    description: "Create a new work order in FieldEdge",
    inputSchema: {
      type: "object" as const,
      properties: {
        customerId: { type: "string", description: "The customer ID (required)" },
        locationId: { type: "string", description: "The service location ID" },
        description: { type: "string", description: "Work order description (required)" },
        workType: { 
          type: "string", 
          description: "Type of work",
          enum: ["service", "repair", "installation", "maintenance", "inspection"]
        },
        priority: { 
          type: "string", 
          description: "Priority level",
          enum: ["low", "normal", "high", "emergency"]
        },
        scheduledDate: { type: "string", description: "Scheduled date in YYYY-MM-DD format" },
        scheduledTime: { type: "string", description: "Scheduled time in HH:MM format" },
        technicianId: { type: "string", description: "Assigned technician ID" },
        equipmentIds: { 
          type: "array", 
          items: { type: "string" },
          description: "Array of equipment IDs related to this work order" 
        },
        notes: { type: "string", description: "Additional notes or instructions" },
      },
      required: ["customerId", "description"],
    },
  },
  {
    name: "list_customers",
    description: "List customers from FieldEdge with search and pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        search: { type: "string", description: "Search query to filter customers by name, email, phone, or address" },
        sortBy: { type: "string", description: "Sort field (e.g., 'name', 'createdAt')" },
        sortOrder: { type: "string", enum: ["asc", "desc"], description: "Sort order" },
      },
    },
  },
  {
    name: "list_technicians",
    description: "List technicians/employees from FieldEdge",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        active: { type: "boolean", description: "Filter by active status" },
        departmentId: { type: "string", description: "Filter by department ID" },
      },
    },
  },
  {
    name: "list_invoices",
    description: "List invoices from FieldEdge",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        status: { 
          type: "string", 
          description: "Filter by invoice status",
          enum: ["draft", "pending", "sent", "paid", "partial", "overdue", "void"]
        },
        customerId: { type: "string", description: "Filter invoices by customer ID" },
        startDate: { type: "string", description: "Filter by invoice date (start) in YYYY-MM-DD format" },
        endDate: { type: "string", description: "Filter by invoice date (end) in YYYY-MM-DD format" },
      },
    },
  },
  {
    name: "list_equipment",
    description: "List equipment records from FieldEdge. Track HVAC units, appliances, and other equipment at customer locations.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of results per page (max: 100)" },
        customerId: { type: "string", description: "Filter equipment by customer ID" },
        locationId: { type: "string", description: "Filter equipment by location ID" },
        equipmentType: { 
          type: "string", 
          description: "Filter by equipment type",
          enum: ["hvac", "plumbing", "electrical", "appliance", "other"]
        },
      },
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: FieldEdgeClient, name: string, args: any) {
  switch (name) {
    case "list_work_orders":
      return await client.listWorkOrders(args);
    
    case "get_work_order":
      return await client.getWorkOrder(args.id);
    
    case "create_work_order":
      return await client.createWorkOrder(args);
    
    case "list_customers":
      return await client.listCustomers(args);
    
    case "list_technicians":
      return await client.listTechnicians(args);
    
    case "list_invoices":
      return await client.listInvoices(args);
    
    case "list_equipment":
      return await client.listEquipment(args);
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.FIELDEDGE_API_KEY;
  const subscriptionKey = process.env.FIELDEDGE_SUBSCRIPTION_KEY;
  
  if (!apiKey) {
    console.error("Error: FIELDEDGE_API_KEY environment variable required");
    process.exit(1);
  }

  const client = new FieldEdgeClient(apiKey, subscriptionKey);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
