import React, { useState, useEffect } from 'react';
import './styles.css';

interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  balance: number;
  lastJob?: string;
  totalJobs: number;
}

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, typeFilter, statusFilter, customers]);

  const loadCustomers = async () => {
    const mockCustomers: Customer[] = [
      { id: 'C001', name: 'John Smith', companyName: 'Smith Enterprises', email: 'john@example.com', phone: '555-0101', type: 'commercial', status: 'active', balance: 1250, lastJob: '2024-02-10', totalJobs: 15 },
      { id: 'C002', name: 'Jane Doe', email: 'jane@example.com', phone: '555-0102', type: 'residential', status: 'active', balance: 0, lastJob: '2024-02-12', totalJobs: 8 },
      { id: 'C003', name: 'Bob Wilson', companyName: 'Wilson LLC', email: 'bob@example.com', phone: '555-0103', type: 'commercial', status: 'active', balance: 2500, lastJob: '2024-01-28', totalJobs: 22 },
      { id: 'C004', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0104', type: 'residential', status: 'inactive', balance: 0, lastJob: '2023-11-15', totalJobs: 3 },
      { id: 'C005', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0105', type: 'residential', status: 'active', balance: 450, lastJob: '2024-02-08', totalJobs: 12 },
      { id: 'C006', name: 'Diana Prince', companyName: 'Prince Industries', email: 'diana@example.com', phone: '555-0106', type: 'commercial', status: 'active', balance: 0, lastJob: '2024-02-11', totalJobs: 19 },
    ];
    setCustomers(mockCustomers);
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customer Grid</h1>
          <p className="text-slate-400">Manage and browse all customers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Total Customers</div>
            <div className="text-2xl font-bold">{customers.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active</div>
            <div className="text-2xl font-bold text-green-400">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Commercial</div>
            <div className="text-2xl font-bold text-blue-400">
              {customers.filter(c => c.type === 'commercial').length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Outstanding Balance</div>
            <div className="text-2xl font-bold text-yellow-400">
              ${customers.reduce((sum, c) => sum + c.balance, 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{customer.name}</div>
                  {customer.companyName && (
                    <div className="text-sm text-slate-400">{customer.companyName}</div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-center ${
                    customer.status === 'active' ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'
                  }`}>
                    {customer.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-center ${
                    customer.type === 'commercial' ? 'bg-blue-400/10 text-blue-400' : 'bg-purple-400/10 text-purple-400'
                  }`}>
                    {customer.type}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">📧</span>
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">📞</span>
                  <span>{customer.phone}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
                <div>
                  <div className="text-slate-400 text-xs">Total Jobs</div>
                  <div className="font-bold text-lg">{customer.totalJobs}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Balance</div>
                  <div className={`font-bold text-lg ${customer.balance > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                    ${customer.balance.toFixed(0)}
                  </div>
                </div>
              </div>

              {customer.lastJob && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-slate-400 text-xs">Last Job</div>
                  <div className="text-sm">{new Date(customer.lastJob).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No customers found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
