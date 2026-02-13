import React, { useState, useEffect } from 'react';
import './styles.css';

interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName?: string;
  jobType: string;
  status: string;
  priority: string;
  description: string;
  scheduledStart?: string;
  assignedTechnicians: string[];
  total: number;
  createdAt: string;
}

interface JobStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  totalRevenue: number;
  avgJobValue: number;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    totalRevenue: 0,
    avgJobValue: 0,
  });
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // In production, this would call the MCP tool
      // const response = await window.mcp.call('fieldedge_list_jobs', { status: filter !== 'all' ? filter : undefined });
      
      // Mock data for demonstration
      const mockJobs: Job[] = [
        {
          id: '1',
          jobNumber: 'JOB-001',
          customerId: 'CUST-001',
          customerName: 'John Smith',
          jobType: 'HVAC Repair',
          status: 'in-progress',
          priority: 'high',
          description: 'AC unit not cooling',
          scheduledStart: new Date().toISOString(),
          assignedTechnicians: ['TECH-001'],
          total: 450.00,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          jobNumber: 'JOB-002',
          customerId: 'CUST-002',
          customerName: 'Jane Doe',
          jobType: 'Plumbing',
          status: 'scheduled',
          priority: 'normal',
          description: 'Leaking faucet repair',
          scheduledStart: new Date(Date.now() + 86400000).toISOString(),
          assignedTechnicians: ['TECH-002'],
          total: 275.00,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          jobNumber: 'JOB-003',
          customerId: 'CUST-003',
          customerName: 'Bob Wilson',
          jobType: 'Electrical',
          status: 'completed',
          priority: 'low',
          description: 'Install ceiling fan',
          scheduledStart: new Date(Date.now() - 86400000).toISOString(),
          assignedTechnicians: ['TECH-003'],
          total: 325.00,
          createdAt: new Date().toISOString(),
        },
      ];

      const filteredJobs = filter === 'all' 
        ? mockJobs 
        : mockJobs.filter(j => j.status === filter);

      setJobs(filteredJobs);
      
      // Calculate stats
      const scheduled = mockJobs.filter(j => j.status === 'scheduled').length;
      const inProgress = mockJobs.filter(j => j.status === 'in-progress').length;
      const completed = mockJobs.filter(j => j.status === 'completed').length;
      const totalRevenue = mockJobs.reduce((sum, j) => sum + j.total, 0);
      
      setStats({
        total: mockJobs.length,
        scheduled,
        inProgress,
        completed,
        totalRevenue,
        avgJobValue: totalRevenue / mockJobs.length || 0,
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-400/10';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'normal': return 'text-blue-400';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Dashboard</h1>
          <p className="text-slate-400">Monitor and manage all field service jobs</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Jobs</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Scheduled</div>
            <div className="text-2xl font-bold text-blue-400">{stats.scheduled}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">In Progress</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Avg Job Value</div>
            <div className="text-2xl font-bold">${stats.avgJobValue.toFixed(2)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">Job #</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Customer</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Type</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Priority</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Scheduled</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="font-medium text-blue-400">{job.jobNumber}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{job.customerName}</div>
                      <div className="text-sm text-slate-400">{job.description}</div>
                    </td>
                    <td className="p-4 text-slate-300">{job.jobType}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {job.scheduledStart 
                        ? new Date(job.scheduledStart).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${job.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
