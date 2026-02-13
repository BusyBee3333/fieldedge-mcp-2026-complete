# FieldEdge MCP Server

Complete MCP server for FieldEdge field service management platform with 87+ tools and 16 React apps.

## Features

### 87+ Tools Across 13 Domains

- **Customer Management** (10 tools): Create, update, search customers, manage balances, view history
- **Job Management** (9 tools): Full CRUD operations, start/complete/cancel jobs, assign technicians
- **Invoice Management** (9 tools): Create, send, void invoices, record payments, generate PDFs
- **Estimate Management** (8 tools): Create quotes, send to customers, approve, convert to invoices
- **Equipment Management** (7 tools): Track equipment, service history, schedule maintenance
- **Technician Management** (9 tools): Manage technicians, schedules, availability, time tracking
- **Scheduling & Dispatch** (8 tools): Create appointments, dispatch board, route optimization
- **Inventory Management** (7 tools): Track parts, adjust quantities, low stock alerts
- **Payment Management** (5 tools): Process payments, refunds, payment history
- **Reporting & Analytics** (8 tools): Revenue, productivity, aging receivables, satisfaction metrics
- **Location Management** (5 tools): Manage customer service locations
- **Service Agreements** (6 tools): Maintenance contracts, renewals, cancellations
- **Task Management** (6 tools): Follow-ups, to-dos, task completion

### 16 React MCP Apps

Modern dark-themed React applications built with Vite:

1. **Dashboard** - Key metrics and recent activity
2. **Customer Management** - Browse and manage customers
3. **Job Management** - View and manage jobs/work orders
4. **Scheduling & Dispatch** - Dispatch board and appointment scheduling
5. **Invoice Management** - Create and manage invoices
6. **Estimate Management** - Create and manage quotes
7. **Technician Management** - Manage technicians and schedules
8. **Equipment Management** - Track customer equipment
9. **Inventory Management** - Parts and equipment inventory
10. **Payment Management** - Process payments
11. **Service Agreements** - Maintenance contracts
12. **Reports & Analytics** - Business reports
13. **Task Management** - Follow-ups and to-dos
14. **Calendar View** - Appointment calendar
15. **Map View** - Geographic view of jobs
16. **Price Book** - Service and part pricing

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with your FieldEdge credentials:

```env
FIELDEDGE_API_KEY=your_api_key_here
FIELDEDGE_API_URL=https://api.fieldedge.com/v1
FIELDEDGE_COMPANY_ID=your_company_id
FIELDEDGE_TIMEOUT=30000
```

## Usage

### As MCP Server

Add to your MCP settings:

```json
{
  "mcpServers": {
    "fieldedge": {
      "command": "npx",
      "args": ["-y", "@mcpengine/fieldedge-mcp-server"],
      "env": {
        "FIELDEDGE_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev

# Build React apps
npm run build:ui
```

## API Coverage

The server provides comprehensive coverage of the FieldEdge API:

- Customer and contact management
- Job/work order lifecycle management
- Scheduling and dispatch operations
- Invoicing and payment processing
- Estimate/quote generation
- Equipment and asset tracking
- Inventory management
- Technician management and time tracking
- Service agreement management
- Business reporting and analytics

## Architecture

```
src/
├── clients/
│   └── fieldedge.ts       # API client with auth, pagination, error handling
├── types/
│   └── index.ts           # TypeScript type definitions
├── tools/
│   ├── customers.ts       # Customer management tools
│   ├── jobs.ts            # Job management tools
│   ├── invoices.ts        # Invoice management tools
│   ├── estimates.ts       # Estimate management tools
│   ├── equipment.ts       # Equipment management tools
│   ├── technicians.ts     # Technician management tools
│   ├── scheduling.ts      # Scheduling and dispatch tools
│   ├── inventory.ts       # Inventory management tools
│   ├── payments.ts        # Payment management tools
│   ├── reporting.ts       # Reporting and analytics tools
│   ├── locations.ts       # Location management tools
│   ├── service-agreements.ts  # Service agreement tools
│   └── tasks.ts           # Task management tools
├── ui/                    # React MCP apps (16 apps)
│   ├── dashboard/
│   ├── customers/
│   ├── jobs/
│   └── ...
├── server.ts              # MCP server implementation
└── main.ts                # Entry point
```

## Error Handling

The client includes comprehensive error handling:

- Authentication errors (401)
- Permission errors (403)
- Not found errors (404)
- Rate limiting (429)
- Server errors (5xx)
- Network errors

## Rate Limiting

Automatic rate limit tracking and retry logic included. The client monitors rate limit headers and automatically waits when limits are approached.

## TypeScript Support

Full TypeScript support with comprehensive type definitions for:

- All API request/response types
- Tool input schemas
- Error types
- Configuration options

## Contributing

Issues and pull requests welcome at [github.com/BusyBee3333/mcpengine](https://github.com/BusyBee3333/mcpengine)

## License

MIT

## Support

For API access and documentation, visit [docs.api.fieldedge.com](https://docs.api.fieldedge.com)
