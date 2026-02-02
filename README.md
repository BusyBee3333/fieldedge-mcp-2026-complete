> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/fieldedge)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 FieldEdge MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire FieldEdge workspace.** Instead of clicking through interfaces, you just *tell* it what you need — and AI handles field service operations, work order management, and customer data at scale.

### ⚡ Field Service Power Moves

Real automation that HVAC, plumbing, and electrical contractors actually use:

1. **Smart Dispatch** — *"Show me all open work orders for tomorrow, find available techs, and assign HVAC jobs to certified technicians"*
2. **Customer Intelligence** — *"Pull all customers with equipment due for maintenance this month and create preventive service work orders"*
3. **Revenue Analysis** — *"List invoices from Q1, break down by service type, and show which equipment categories generate the most revenue"*
4. **Rapid Quoting** — *"Get all work orders marked as 'estimate needed,' pull equipment specs from customer locations, and draft service proposals"*
5. **Equipment Tracking** — *"Show all HVAC units installed in 2020-2021 that haven't had service in 12+ months and create follow-up tasks"*

### 🔗 The Real Power: Combining Tools

AI can chain multiple FieldEdge operations together:

- Query work orders → Filter by technician availability → Auto-schedule → Notify customer
- Search equipment records → Check warranty status → Generate service recommendations
- Analyze customer history → Identify upsell opportunities → Create follow-up jobs
- Pull invoice data → Export to accounting → Generate financial reports

## 📦 What's Inside

**7 Field Service API Tools** covering work order management, dispatching, invoicing, and customer data:

- `list_work_orders` — Query work orders by status, customer, technician, date range
- `get_work_order` — Get full work order details (line items, equipment, schedule)
- `create_work_order` — Create new service jobs with priority, scheduling, and tech assignment
- `list_customers` — Search and retrieve customer records
- `list_technicians` — Get technician/employee roster with availability and departments
- `list_invoices` — Pull invoicing data by status, customer, and date range
- `list_equipment` — Track HVAC units, appliances, and equipment at customer sites

All with proper error handling, automatic authentication, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/FieldEdge-MCP-2026-Complete.git
   cd fieldedge-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your FieldEdge API credentials:**
   
   - Log in to your FieldEdge account
   - Navigate to Settings → API Keys
   - Generate a new API key with appropriate permissions
   - You'll receive an API key and subscription key (Azure API Management)
   - See [FieldEdge API Documentation](https://api.fieldedge.com/docs) for details

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "fieldedge": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/fieldedge-mcp-2026-complete/dist/index.js"],
         "env": {
           "FIELDEDGE_API_KEY": "your-api-key-here",
           "FIELDEDGE_SUBSCRIPTION_KEY": "your-subscription-key-here"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/fieldedge-mcp)

1. Click the button above
2. Set your FieldEdge API credentials in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t fieldedge-mcp .
docker run -p 3000:3000 \
  -e FIELDEDGE_API_KEY=your-key \
  -e FIELDEDGE_SUBSCRIPTION_KEY=your-subscription-key \
  fieldedge-mcp
```

## 🔐 Authentication

FieldEdge uses **API Key authentication** via Azure API Management.

**API Base URL:** `https://api.fieldedge.com/v1`

**Required Headers:**
- `Authorization: Bearer YOUR_API_KEY`
- `Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY`

The MCP server handles authentication automatically once you provide credentials in your environment variables.

**Getting credentials:**
1. Log in to FieldEdge
2. Settings → API Access
3. Generate API Key + Subscription Key
4. Set appropriate permissions (read/write for work orders, customers, etc.)

See the official [FieldEdge API documentation](https://api.fieldedge.com/docs) for detailed authentication steps.

## 🎯 Example Prompts for Field Service Pros

Once connected to Claude, use natural language for HVAC, plumbing, electrical, and field service workflows:

**Dispatching & Scheduling:**
- *"Show me all open work orders scheduled for next week"*
- *"List available technicians for tomorrow and show their current job assignments"*
- *"Create an emergency HVAC repair work order for customer ID 12345 at their main location"*

**Customer Management:**
- *"Find customers in zip code 75001 who have HVAC equipment older than 10 years"*
- *"Search for 'Johnson' in customer records and show their service history"*

**Equipment & Maintenance:**
- *"List all equipment at customer location X and show last service dates"*
- *"Find HVAC units due for seasonal maintenance and create work orders"*

**Invoicing & Revenue:**
- *"Pull all paid invoices from last month and calculate total revenue"*
- *"Show invoices over $5,000 that are still pending payment"*

**Bulk Operations:**
- *"For all customers with 'annual maintenance' contracts, check equipment records and schedule Q2 service visits"*
- *"Export work order data for completed jobs last quarter and summarize by service type"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- FieldEdge account with API access

### Setup

```bash
git clone https://github.com/BusyBee3333/FieldEdge-MCP-2026-Complete.git
cd fieldedge-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your FieldEdge credentials
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Authentication failed"
- Verify both API key and subscription key are correct
- Check that your keys haven't been revoked in FieldEdge settings
- Ensure you have the necessary permissions for the operations you're attempting
- Test credentials directly via [FieldEdge API docs](https://api.fieldedge.com/docs)

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is **absolute** (not relative)
- Verify the build completed successfully (`dist/index.js` exists)
- Check Claude Desktop logs (Help → View Logs)

### "Rate limit exceeded"
- FieldEdge enforces API rate limits
- Implement pagination for large queries
- Use date filters to reduce result sets

## 📖 Resources

- [FieldEdge API Documentation](https://api.fieldedge.com/docs)
- [FieldEdge Developer Portal](https://developer.fieldedge.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for field service and business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms including Housecall Pro, Jobber, ServiceTitan, and more.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
