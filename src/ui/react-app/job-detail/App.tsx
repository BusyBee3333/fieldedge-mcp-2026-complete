import React, { useState, useEffect } from 'react';
import './styles.css';

interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  jobType: string;
  status: string;
  priority: string;
  description: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  assignedTechnicians: Array<{ id: string; name: string }>;
  lineItems: Array<{
    id: string;
    type: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export default function App() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'timeline'>('details');

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    setLoading(true);
    try {
      // Mock job data
      const mockJob: Job = {
        id: '1',
        jobNumber: 'JOB-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        customerPhone: '(555) 123-4567',
        customerEmail: 'john.smith@example.com',
        jobType: 'HVAC Repair',
        status: 'in-progress',
        priority: 'high',
        description: 'AC unit not cooling properly. Customer reports warm air from vents.',
        scheduledStart: new Date().toISOString(),
        scheduledEnd: new Date(Date.now() + 7200000).toISOString(),
        assignedTechnicians: [
          { id: 'TECH-001', name: 'Mike Johnson' },
        ],
        lineItems: [
          {
            id: '1',
            type: 'labor',
            description: 'Diagnostic and repair service',
            quantity: 2,
            unitPrice: 125.00,
            total: 250.00,
          },
          {
            id: '2',
            type: 'part',
            description: 'Refrigerant R-410A (5 lbs)',
            quantity: 5,
            unitPrice: 30.00,
            total: 150.00,
          },
          {
            id: '3',
            type: 'part',
            description: 'Air filter replacement',
            quantity: 1,
            unitPrice: 35.00,
            total: 35.00,
          },
        ],
        subtotal: 435.00,
        tax: 34.80,
        total: 469.80,
        notes: 'Customer mentioned system was serviced 6 months ago. Check warranty status.',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701',
        },
      };
      setJob(mockJob);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-400/10 text-blue-400',
      dispatched: 'bg-purple-400/10 text-purple-400',
      'in-progress': 'bg-yellow-400/10 text-yellow-400',
      completed: 'bg-green-400/10 text-green-400',
      cancelled: 'bg-red-400/10 text-red-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-400/10 text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.jobNumber}</h1>
              <p className="text-slate-400">{job.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg font-medium ${getStatusBadge(job.status)}`}>
              {job.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-6">
          <div className="flex gap-6">
            {['details', 'items', 'timeline'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-400 text-sm">Name</div>
                  <div className="font-medium">{job.customerName}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Phone</div>
                  <div className="font-medium">{job.customerPhone}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Email</div>
                  <div className="font-medium">{job.customerEmail}</div>
                </div>
                {job.address && (
                  <div>
                    <div className="text-slate-400 text-sm">Service Address</div>
                    <div className="font-medium">
                      {job.address.street}<br />
                      {job.address.city}, {job.address.state} {job.address.zip}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-400 text-sm">Job Type</div>
                  <div className="font-medium">{job.jobType}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Priority</div>
                  <div className="font-medium capitalize">{job.priority}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Scheduled Time</div>
                  <div className="font-medium">
                    {new Date(job.scheduledStart!).toLocaleString()} - {' '}
                    {new Date(job.scheduledEnd!).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Assigned Technicians</div>
                  <div className="font-medium">
                    {job.assignedTechnicians.map(t => t.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {job.notes && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <p className="text-slate-300">{job.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Line Items */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-semibold">Type</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Description</th>
                    <th className="text-right p-4 text-slate-300 font-semibold">Qty</th>
                    <th className="text-right p-4 text-slate-300 font-semibold">Unit Price</th>
                    <th className="text-right p-4 text-slate-300 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {job.lineItems.map(item => (
                    <tr key={item.id} className="border-b border-slate-700">
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs capitalize">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{item.description}</td>
                      <td className="p-4 text-right">{item.quantity}</td>
                      <td className="p-4 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${job.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax</span>
                  <span>${job.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-700">
                  <span>Total</span>
                  <span>${job.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium">Job Created</div>
                  <div className="text-sm text-slate-400">
                    {new Date(job.scheduledStart!).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium">Technician Assigned</div>
                  <div className="text-sm text-slate-400">
                    {job.assignedTechnicians.map(t => t.name).join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium">Job In Progress</div>
                  <div className="text-sm text-slate-400">Currently active</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
