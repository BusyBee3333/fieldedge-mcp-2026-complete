import React, { useState } from 'react';
import './styles.css';

interface Job {
  id: string;
  jobNumber: string;
  customerName: string;
  address: string;
  type: string;
  scheduledTime: string;
  status: string;
  priority: string;
}

export default function App() {
  const [selectedTech, setSelectedTech] = useState('Mike Johnson');
  const [todayJobs] = useState<Job[]>([
    { id: '1', jobNumber: 'JOB-001', customerName: 'John Smith', address: '123 Main St', type: 'HVAC Repair', scheduledTime: '09:00 AM', status: 'in-progress', priority: 'high' },
    { id: '2', jobNumber: 'JOB-005', customerName: 'Bob Wilson', address: '456 Oak Ave', type: 'Maintenance', scheduledTime: '01:00 PM', status: 'scheduled', priority: 'normal' },
    { id: '3', jobNumber: 'JOB-008', customerName: 'Alice Johnson', address: '789 Pine Rd', type: 'Inspection', scheduledTime: '03:00 PM', status: 'scheduled', priority: 'low' },
  ]);

  const stats = {
    jobsToday: 3,
    jobsCompleted: 0,
    hoursWorked: 2.5,
    revenueToday: 1200,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-400/10 text-green-400';
      case 'in-progress': return 'bg-yellow-400/10 text-yellow-400';
      case 'scheduled': return 'bg-blue-400/10 text-blue-400';
      default: return 'bg-gray-400/10 text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'normal': return 'border-l-4 border-blue-500';
      case 'low': return 'border-l-4 border-gray-500';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-slate-400">Welcome back, {selectedTech}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Jobs Today</div>
            <div className="text-3xl font-bold">{stats.jobsToday}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-400">{stats.jobsCompleted}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Hours Worked</div>
            <div className="text-3xl font-bold text-blue-400">{stats.hoursWorked}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Revenue Today</div>
            <div className="text-3xl font-bold text-yellow-400">${stats.revenueToday}</div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todayJobs.map(job => (
              <div
                key={job.id}
                className={`bg-slate-750 rounded-lg p-5 hover:bg-slate-700 transition-colors cursor-pointer ${getPriorityBadge(job.priority)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-lg text-blue-400 mb-1">{job.jobNumber}</div>
                    <div className="text-slate-300 font-medium">{job.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm mb-1">Scheduled</div>
                    <div className="font-medium">{job.scheduledTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{job.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔧</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-600">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors">
                      View Details
                    </button>
                    {job.status === 'scheduled' && (
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors">
                        Start Job
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors">
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 text-left transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold mb-1">Job History</div>
            <div className="text-sm text-slate-400">View completed jobs</div>
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 text-left transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold mb-1">Inventory</div>
            <div className="text-sm text-slate-400">Check parts & equipment</div>
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 text-left transition-colors">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="font-semibold mb-1">Time Tracking</div>
            <div className="text-sm text-slate-400">Log hours worked</div>
          </button>
        </div>
      </div>
    </div>
  );
}
