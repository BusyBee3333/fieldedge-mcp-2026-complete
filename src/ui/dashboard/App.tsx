import { useState, useEffect } from 'react';
import './styles.css';

interface DashboardMetrics {
  totalJobs: number;
  activeJobs: number;
  completedToday: number;
  pendingInvoices: number;
  revenue: { today: number; month: number };
  technicians: { active: number; total: number };
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalJobs: 0,
    activeJobs: 0,
    completedToday: 0,
    pendingInvoices: 0,
    revenue: { today: 0, month: 0 },
    technicians: { active: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMetrics({
        totalJobs: 147,
        activeJobs: 23,
        completedToday: 8,
        pendingInvoices: 15,
        revenue: { today: 4250, month: 87450 },
        technicians: { active: 12, total: 15 },
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>FieldEdge Dashboard</h1>
        <div className="date">{new Date().toLocaleDateString()}</div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Jobs</div>
          <div className="metric-value">{metrics.totalJobs}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Active Jobs</div>
          <div className="metric-value">{metrics.activeJobs}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Completed Today</div>
          <div className="metric-value">{metrics.completedToday}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Pending Invoices</div>
          <div className="metric-value">{metrics.pendingInvoices}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Today's Revenue</div>
          <div className="metric-value">${metrics.revenue.today.toLocaleString()}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Month Revenue</div>
          <div className="metric-value">${metrics.revenue.month.toLocaleString()}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Active Technicians</div>
          <div className="metric-value">
            {metrics.technicians.active} / {metrics.technicians.total}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">10:30 AM</span>
            <span className="activity-text">Job #1234 completed by John Smith</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">09:45 AM</span>
            <span className="activity-text">New job created for ACME Corp</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">09:15 AM</span>
            <span className="activity-text">Invoice #INV-5678 paid - $1,250.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
