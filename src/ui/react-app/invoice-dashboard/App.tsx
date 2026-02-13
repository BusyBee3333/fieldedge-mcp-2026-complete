import React, { useState, useEffect } from 'react';
import './styles.css';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  status: string;
  issueDate: string;
  dueDate: string;
  total: number;
  balance: number;
  daysOverdue?: number;
}

interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  avgInvoiceValue: number;
}

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    overdueAmount: 0,
    avgInvoiceValue: 0,
  });
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadInvoices();
  }, [filter]);

  const loadInvoices = async () => {
    const mockInvoices: Invoice[] = [
      { id: '1', invoiceNumber: 'INV-001', customerName: 'John Smith', status: 'paid', issueDate: '2024-01-15', dueDate: '2024-02-15', total: 450, balance: 0 },
      { id: '2', invoiceNumber: 'INV-002', customerName: 'Jane Doe', status: 'sent', issueDate: '2024-02-01', dueDate: '2024-03-01', total: 275, balance: 275 },
      { id: '3', invoiceNumber: 'INV-003', customerName: 'Bob Wilson', status: 'overdue', issueDate: '2024-01-05', dueDate: '2024-02-05', total: 850, balance: 850, daysOverdue: 7 },
      { id: '4', invoiceNumber: 'INV-004', customerName: 'Alice Johnson', status: 'partial', issueDate: '2024-01-20', dueDate: '2024-02-20', total: 1200, balance: 400 },
      { id: '5', invoiceNumber: 'INV-005', customerName: 'Charlie Brown', status: 'draft', issueDate: '2024-02-10', dueDate: '2024-03-10', total: 325, balance: 325 },
    ];

    const filteredInvoices = filter === 'all'
      ? mockInvoices
      : mockInvoices.filter(i => i.status === filter);

    setInvoices(filteredInvoices);

    // Calculate stats
    const totalRevenue = mockInvoices.reduce((sum, i) => sum + i.total, 0);
    const paidAmount = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
    const outstandingAmount = mockInvoices.reduce((sum, i) => sum + i.balance, 0);
    const overdueAmount = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.balance, 0);

    setStats({
      totalInvoices: mockInvoices.length,
      totalRevenue,
      paidAmount,
      outstandingAmount,
      overdueAmount,
      avgInvoiceValue: totalRevenue / mockInvoices.length,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-400/10 text-green-400';
      case 'sent': return 'bg-blue-400/10 text-blue-400';
      case 'partial': return 'bg-yellow-400/10 text-yellow-400';
      case 'overdue': return 'bg-red-400/10 text-red-400';
      case 'draft': return 'bg-gray-400/10 text-gray-400';
      default: return 'bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Invoice Dashboard</h1>
          <p className="text-slate-400">Track and manage all invoices</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Invoices</div>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Paid</div>
            <div className="text-2xl font-bold text-green-400">${stats.paidAmount.toFixed(0)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-yellow-400">${stats.outstandingAmount.toFixed(0)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-400">${stats.overdueAmount.toFixed(0)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Avg Value</div>
            <div className="text-2xl font-bold">${stats.avgInvoiceValue.toFixed(0)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'draft', 'sent', 'partial', 'paid', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">Invoice #</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Customer</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Issue Date</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Due Date</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Total</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr
                  key={invoice.id}
                  className="border-b border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  <td className="p-4 font-medium text-blue-400">{invoice.invoiceNumber}</td>
                  <td className="p-4 text-slate-300">{invoice.customerName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                      {invoice.daysOverdue && (
                        <span className="text-xs text-red-400">
                          {invoice.daysOverdue}d overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-slate-300">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-medium">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-medium">
                    <span className={invoice.balance > 0 ? 'text-yellow-400' : 'text-green-400'}>
                      ${invoice.balance.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
