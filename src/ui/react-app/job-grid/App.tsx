import React, { useState, useEffect } from 'react';
import './styles.css';

interface Job {
  id: string;
  jobNumber: string;
  customerName: string;
  jobType: string;
  status: string;
  priority: string;
  scheduledStart?: string;
  total: number;
  technician?: string;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, statusFilter, priorityFilter, jobs]);

  const loadJobs = async () => {
    // Mock data
    const mockJobs: Job[] = [
      { id: '1', jobNumber: 'JOB-001', customerName: 'John Smith', jobType: 'HVAC Repair', status: 'in-progress', priority: 'high', scheduledStart: new Date().toISOString(), total: 450.00, technician: 'Mike J.' },
      { id: '2', jobNumber: 'JOB-002', customerName: 'Jane Doe', jobType: 'Plumbing', status: 'scheduled', priority: 'normal', scheduledStart: new Date(Date.now() + 86400000).toISOString(), total: 275.00, technician: 'Sarah K.' },
      { id: '3', jobNumber: 'JOB-003', customerName: 'Bob Wilson', jobType: 'Electrical', status: 'completed', priority: 'low', scheduledStart: new Date(Date.now() - 86400000).toISOString(), total: 325.00, technician: 'Tom R.' },
      { id: '4', jobNumber: 'JOB-004', customerName: 'Alice Johnson', jobType: 'HVAC Install', status: 'scheduled', priority: 'high', scheduledStart: new Date(Date.now() + 172800000).toISOString(), total: 1250.00, technician: 'Mike J.' },
      { id: '5', jobNumber: 'JOB-005', customerName: 'Charlie Brown', jobType: 'Inspection', status: 'completed', priority: 'normal', scheduledStart: new Date(Date.now() - 172800000).toISOString(), total: 150.00, technician: 'Sarah K.' },
      { id: '6', jobNumber: 'JOB-006', customerName: 'Diana Prince', jobType: 'Repair', status: 'in-progress', priority: 'emergency', scheduledStart: new Date().toISOString(), total: 850.00, technician: 'Tom R.' },
    ];
    setJobs(mockJobs);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(job => job.priority === priorityFilter);
    }

    setFilteredJobs(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      emergency: 'border-red-500',
      high: 'border-orange-500',
      normal: 'border-blue-500',
      low: 'border-gray-500',
    };
    return colors[priority as keyof typeof colors] || 'border-gray-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Grid</h1>
          <p className="text-slate-400">Visual overview of all jobs</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search jobs, customers, types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={`bg-slate-800 rounded-lg p-5 border-l-4 ${getPriorityColor(job.priority)} hover:bg-slate-750 transition-colors cursor-pointer`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-blue-400 mb-1">{job.jobNumber}</div>
                  <div className="text-sm text-slate-400">{job.jobType}</div>
                </div>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`}></span>
              </div>

              {/* Customer */}
              <div className="mb-3">
                <div className="text-slate-300 font-medium">{job.customerName}</div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Priority:</span>
                  <span className="capitalize font-medium">{job.priority}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Technician:</span>
                  <span className="font-medium">{job.technician}</span>
                </div>
                {job.scheduledStart && (
                  <div className="flex justify-between text-slate-400">
                    <span>Scheduled:</span>
                    <span className="font-medium">
                      {new Date(job.scheduledStart).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  job.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                  job.status === 'in-progress' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-blue-400/10 text-blue-400'
                }`}>
                  {job.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-lg font-bold">${job.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No jobs found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
