#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiDir = join(__dirname, '../src/ui');

const apps = [
  { name: 'customers', title: 'Customer Management', description: 'Browse and manage customers' },
  { name: 'jobs', title: 'Job Management', description: 'View and manage jobs/work orders' },
  { name: 'scheduling', title: 'Scheduling & Dispatch', description: 'Dispatch board and appointment scheduling' },
  { name: 'invoices', title: 'Invoice Management', description: 'Create and manage invoices' },
  { name: 'estimates', title: 'Estimate Management', description: 'Create and manage estimates/quotes' },
  { name: 'technicians', title: 'Technician Management', description: 'Manage technicians and schedules' },
  { name: 'equipment', title: 'Equipment Management', description: 'Track customer equipment' },
  { name: 'inventory', title: 'Inventory Management', description: 'Manage parts and equipment inventory' },
  { name: 'payments', title: 'Payment Management', description: 'Process payments and view history' },
  { name: 'service-agreements', title: 'Service Agreements', description: 'Manage maintenance contracts' },
  { name: 'reports', title: 'Reports & Analytics', description: 'Business reports and analytics' },
  { name: 'tasks', title: 'Task Management', description: 'Manage follow-ups and to-dos' },
  { name: 'calendar', title: 'Calendar View', description: 'Calendar view of appointments' },
  { name: 'map-view', title: 'Map View', description: 'Map view of jobs and technicians' },
  { name: 'price-book', title: 'Price Book', description: 'Manage pricing for services' },
];

const createApp = (app) => {
  const appDir = join(uiDir, app.name);
  mkdirSync(appDir, { recursive: true });

  // App.tsx
  const appTsx = `import { useState, useEffect } from 'react';
import './styles.css';

export default function ${app.name.replace(/-/g, '')}App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: '1', name: 'Sample Item 1', status: 'active' },
        { id: '2', name: 'Sample Item 2', status: 'active' },
        { id: '3', name: 'Sample Item 3', status: 'pending' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading ${app.title.toLowerCase()}...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>${app.title}</h1>
        <button className="btn-primary">+ Add New</button>
      </header>

      <div className="content">
        <div className="section">
          <h2>${app.description}</h2>
          <div className="data-grid">
            {data.map((item) => (
              <div key={item.id} className="data-card">
                <h3>{item.name}</h3>
                <span className={\`badge badge-\${item.status}\`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

  // styles.css (shared dark theme)
  const stylesCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #0f1419;
  color: #e8eaed;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
}

.btn-primary {
  background: #4c9aff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #3d8aef;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #9aa0a6;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  background: #1e2732;
  border: 1px solid #2d3748;
  border-radius: 8px;
  padding: 1.5rem;
}

.section h2 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #e8eaed;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.data-card {
  background: #131920;
  border: 1px solid #2d3748;
  border-radius: 6px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;
}

.data-card:hover {
  border-color: #4c9aff;
}

.data-card h3 {
  font-size: 1rem;
  font-weight: 500;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-active {
  background: #1a4d2e;
  color: #4ade80;
}

.badge-pending {
  background: #4a3810;
  color: #fbbf24;
}

.badge-completed {
  background: #1e3a8a;
  color: #60a5fa;
}
`;

  // main.tsx
  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

  // index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${app.title} - FieldEdge</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/main.tsx"></script>
</body>
</html>
`;

  // vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../../dist/ui/${app.name}',
    emptyOutDir: true,
  },
});
`;

  writeFileSync(join(appDir, 'App.tsx'), appTsx);
  writeFileSync(join(appDir, 'styles.css'), stylesCss);
  writeFileSync(join(appDir, 'main.tsx'), mainTsx);
  writeFileSync(join(appDir, 'index.html'), indexHtml);
  writeFileSync(join(appDir, 'vite.config.ts'), viteConfig);

  console.log(`Created app: ${app.name}`);
};

apps.forEach(createApp);
console.log(`\nSuccessfully created ${apps.length} React apps!`);
