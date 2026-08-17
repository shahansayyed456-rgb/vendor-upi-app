import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Printer,
  Trash2,
  Store,
} from 'lucide-react';
import type { Vendor } from '../types';
import { maskVPA } from '../utils/upi';

interface VendorsProps {
  vendors: Vendor[];
  onNavigateToCreate: () => void;
  onSelectVendor: (vendor: Vendor) => void;
  onOpenPrintableCard: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

const CATEGORIES: string[] = [
  'All Categories',
  'Tea Stall',
  'Kirana Shop',
  'Fruit Seller',
  'Vegetable Seller',
  'Food Cart',
  'Juice Stall',
  'Bakery',
  'Other',
];

export const Vendors: React.FC<VendorsProps> = ({
  vendors,
  onNavigateToCreate,
  onSelectVendor,
  onOpenPrintableCard,
  onDeleteVendor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Filter & Search Logic
  const filteredVendors = vendors
    .filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vpa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.businessType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'All Categories' || v.businessType === selectedCategory;

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor name, UPI ID, category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>

            <button
              onClick={onNavigateToCreate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Vendor
            </button>
          </div>
        </div>

        {/* Status Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredVendors.length}</strong> of <strong>{vendors.length}</strong> vendors
          </span>
          <span className="text-[11px] text-slate-400">
            UPI VPAs partially masked for privacy compliance
          </span>
        </div>
      </div>

      {/* Vendors Table / Cards View */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No vendors found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchTerm || selectedCategory !== 'All Categories'
              ? 'Try adjusting your search query or category filters.'
              : 'Start your CEP fieldwork log by creating your first vendor QR code.'}
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Vendor QR
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Vendor Name</th>
                  <th className="py-3.5 px-4">Business Type</th>
                  <th className="py-3.5 px-4">Masked UPI VPA</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {vendor.name}
                          </span>
                          {vendor.isDemo && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-200">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {vendor.businessType}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      {maskVPA(vendor.vpa)}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {vendor.amount ? (
                        <span className="text-emerald-700 font-bold">
                          ₹{vendor.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Dynamic</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectVendor(vendor)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details & QR"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenPrintableCard(vendor)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Print Standee Card"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteVendor(vendor.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {vendor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{vendor.name}</h4>
                      <p className="text-xs font-mono text-slate-500">{maskVPA(vendor.vpa)}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {vendor.businessType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPrintableCard(vendor)}
                      className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[11px] flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Card
                    </button>
                    <button
                      onClick={() => onSelectVendor(vendor)}
                      className="p-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
