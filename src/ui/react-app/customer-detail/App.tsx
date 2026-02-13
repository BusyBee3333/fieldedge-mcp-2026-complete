import React, { useState, useEffect } from 'react';
import './styles.css';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  status: string;
  customerType: string;
  balance: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tags: string[];
  createdAt: string;
}

interface Job {
  id: string;
  jobNumber: string;
  jobType: string;
  status: string;
  date: string;
  total: number;
}

export default function App() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'invoices' | 'equipment'>('overview');

  useEffect(() => {
    loadCustomer();
    loadJobs();
  }, []);

  const loadCustomer = async () => {
    const mockCustomer: Customer = {
      id: 'CUST-001',
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Smith Enterprises',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      mobilePhone: '(555) 987-6543',
      status: 'active',
      customerType: 'commercial',
      balance: 1250.00,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      },
      tags: ['VIP', 'Service Contract', 'Monthly Billing'],
      createdAt: '2023-01-15T00:00:00Z',
    };
    setCustomer(mockCustomer);
  };

  const loadJobs = async () => {
    const mockJobs: Job[] = [
      { id: '1', jobNumber: 'JOB-001', jobType: 'HVAC Repair', status: 'completed', date: '2024-01-20', total: 450.00 },
      { id: '2', jobNumber: 'JOB-015', jobType: 'Maintenance', status: 'completed', date: '2023-12-10', total: 275.00 },
      { id: '3', jobNumber: 'JOB-032', jobType: 'Installation', status: 'in-progress', date: '2024-02-05', total: 1850.00 },
    ];
    setJobs(mockJobs);
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              <h1 className="text-3xl font-bold mb-2">
                {customer.firstName} {customer.lastName}
              </h1>
              {customer.companyName && (
                <p className="text-slate-400 text-lg">{customer.companyName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <span className={`px-4 py-2 rounded-lg font-medium ${
                customer.status === 'active' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
              }`}>
                {customer.status.toUpperCase()}
              </span>
              <span className="px-4 py-2 rounded-lg font-medium bg-blue-400/10 text-blue-400 capitalize">
                {customer.customerType}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-6">
          <div className="flex gap-6">
            {['overview', 'jobs', 'invoices', 'equipment'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-400 text-sm">Email</div>
                  <div className="font-medium">{customer.email}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Phone</div>
                  <div className="font-medium">{customer.phone}</div>
                </div>
                {customer.mobilePhone && (
                  <div>
                    <div className="text-slate-400 text-sm">Mobile</div>
                    <div className="font-medium">{customer.mobilePhone}</div>
                  </div>
                )}
                <div>
                  <div className="text-slate-400 text-sm">Address</div>
                  <div className="font-medium">
                    {customer.address.street}<br />
                    {customer.address.city}, {customer.address.state} {customer.address.zip}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-400 text-sm">Customer ID</div>
                  <div className="font-medium">{customer.id}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Customer Since</div>
                  <div className="font-medium">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Current Balance</div>
                  <div className={`text-xl font-bold ${customer.balance > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                    ${customer.balance.toFixed(2)}
                  </div>
                </div>
                {customer.tags.length > 0 && (
                  <div>
                    <div className="text-slate-400 text-sm mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Total Jobs</div>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Completed Jobs</div>
                  <div className="text-2xl font-bold text-green-400">
                    {jobs.filter(j => j.status === 'completed').length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Active Jobs</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {jobs.filter(j => j.status === 'in-progress').length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Lifetime Value</div>
                  <div className="text-2xl font-bold">
                    ${jobs.reduce((sum, j) => sum + j.total, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-semibold">Job #</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Type</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Date</th>
                  <th className="text-right p-4 text-slate-300 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="p-4 font-medium text-blue-400">{job.jobNumber}</td>
                    <td className="p-4 text-slate-300">{job.jobType}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{new Date(job.date).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-medium">${job.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'invoices' || activeTab === 'equipment') && (
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center text-slate-400">
            <div className="text-lg">No {activeTab} data available</div>
          </div>
        )}
      </div>
    </div>
  );
}
