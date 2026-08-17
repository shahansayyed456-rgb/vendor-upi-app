import React, { useState } from 'react';
import { CreditCard, Printer, Sparkles, Filter } from 'lucide-react';
import type { Vendor } from '../types';
import { PrintableCard } from '../components/PrintableCard';
import { Modal } from '../components/Modal';

interface QRCardsProps {
  vendors: Vendor[];
  onNavigateToCreate: () => void;
}

export const QRCards: React.FC<QRCardsProps> = ({ vendors, onNavigateToCreate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePrintVendor, setActivePrintVendor] = useState<Vendor | null>(null);

  const categories = ['All', ...Array.from(new Set(vendors.map((v) => v.businessType)))];

  const filteredVendors =
    selectedCategory === 'All'
      ? vendors
      : vendors.filter((v) => v.businessType === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Shopfront Counter Cards
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Printable QR Counter Standees
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            High-resolution printable cards ready to be printed, laminated, and placed at shop counters.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none pr-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Standee Cards Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No QR Cards Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add a vendor first to generate printable counter standee cards.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors"
          >
            Create First Vendor QR
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                    {vendor.businessType}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/60 my-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center mx-auto mb-2 shadow-sm">
                    {vendor.name.charAt(0)}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {vendor.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {vendor.vpa}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {vendor.printedCardCount || 0} Prints
                </span>

                <button
                  onClick={() => setActivePrintVendor(vendor)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Card Modal View */}
      {activePrintVendor && (
        <Modal
          isOpen={!!activePrintVendor}
          onClose={() => setActivePrintVendor(null)}
          maxWidth="lg"
        >
          <PrintableCard
            vendor={activePrintVendor}
            onClose={() => setActivePrintVendor(null)}
          />
        </Modal>
      )}
    </div>
  );
};
