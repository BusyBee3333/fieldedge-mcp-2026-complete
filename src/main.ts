#!/usr/bin/env node

/**
 * FieldEdge MCP Server Entry Point
 */

import 'dotenv/config';
import { FieldEdgeServer } from './server.js';
import { initializeFieldEdgeClient } from './clients/fieldedge.js';

async function main() {
  try {
    // Get API key from environment
    const apiKey = process.env.FIELDEDGE_API_KEY;
    if (!apiKey) {
      console.error('Error: FIELDEDGE_API_KEY environment variable is required');
      console.error('Please set it in your environment or .env file');
      process.exit(1);
    }

    // Initialize FieldEdge client
    initializeFieldEdgeClient({
      apiKey,
      apiUrl: process.env.FIELDEDGE_API_URL,
      companyId: process.env.FIELDEDGE_COMPANY_ID,
      timeout: process.env.FIELDEDGE_TIMEOUT 
        ? parseInt(process.env.FIELDEDGE_TIMEOUT) 
        : undefined,
    });

    // Start server
    const server = new FieldEdgeServer();
    await server.run();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
