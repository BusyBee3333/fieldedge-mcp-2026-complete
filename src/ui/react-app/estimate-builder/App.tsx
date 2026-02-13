import React, { useState } from 'react';
import './styles.css';

interface LineItem {
  id: string;
  type: 'service' | 'part' | 'labor';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function App() {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newItem, setNewItem] = useState({
    type: 'service' as 'service' | 'part' | 'labor',
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(8);
  const [notes, setNotes] = useState('');

  const addLineItem = () => {
    if (!newItem.description || newItem.unitPrice <= 0) return;

    const item: LineItem = {
      id: Date.now().toString(),
      type: newItem.type,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      total: newItem.quantity * newItem.unitPrice,
    };

    setLineItems([...lineItems, item]);
    setNewItem({ type: 'service', description: '', quantity: 1, unitPrice: 0 });
  };

  const removeItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * (taxPercent / 100);
  const total = taxableAmount + tax;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estimate Builder</h1>
          <p className="text-slate-400">Create professional estimates for customers</p>
        </div>

        {/* Customer Selection */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          <input
            type="text"
            placeholder="Search customer by name or email..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          {!selectedCustomer && customerSearch && (
            <div className="mt-2 text-sm text-slate-400">
              Select a customer or create a new one
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">Line Items</h3>
          
          {/* Add Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-4 bg-slate-750 rounded-lg">
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="service">Service</option>
              <option value="part">Part</option>
              <option value="labor">Labor</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="md:col-span-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={addLineItem}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            + Add Line Item
          </button>

          {/* Items Table */}
          {lineItems.length > 0 && (
            <div className="mt-6 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="text-left p-3 text-slate-300 font-semibold">Type</th>
                    <th className="text-left p-3 text-slate-300 font-semibold">Description</th>
                    <th className="text-right p-3 text-slate-300 font-semibold">Qty</th>
                    <th className="text-right p-3 text-slate-300 font-semibold">Price</th>
                    <th className="text-right p-3 text-slate-300 font-semibold">Total</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(item => (
                    <tr key={item.id} className="border-t border-slate-700">
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-400/10 text-blue-400 rounded text-xs capitalize">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{item.description}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pricing</h3>
          <div className="max-w-md ml-auto space-y-4">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Discount</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-right focus:outline-none focus:border-blue-500"
                />
                <span>%</span>
                <span className="w-24 text-right font-medium">-${discount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Tax</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-right focus:outline-none focus:border-blue-500"
                />
                <span>%</span>
                <span className="w-24 text-right font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-700">
              <span>Total</span>
              <span className="text-blue-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or terms for this estimate..."
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            Send Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
