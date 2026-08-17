import React from 'react';
import {
  Users,
  QrCode,
  Printer,
  Grid,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  Store,
} from 'lucide-react';
import type { Vendor } from '../types';
import { StatCard } from '../components/StatCard';
import { maskVPA } from '../utils/upi';

interface DashboardProps {
  vendors: Vendor[];
  onNavigateToCreate: () => void;
  onNavigateToVendors: () => void;
  onSelectVendor: (vendor: Vendor) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  vendors,
  onNavigateToCreate,
  onNavigateToVendors,
  onSelectVendor,
}) => {
  // Calculate dynamic stats
  const totalVendors = vendors.length;
  const qrGeneratedCount = vendors.filter((v) => v.qrGenerated).length;
  const cardsPrintedCount = vendors.reduce((acc, v) => acc + (v.printedCardCount || 0), 0);
  const categoriesCount = new Set(vendors.map((v) => v.businessType)).size;

  const targetCount = 10; // CEP benchmark goal
  const progressPercent = Math.min(100, Math.round((totalVendors / targetCount) * 100));

  // Category distribution calculation
  const categoryCounts: Record<string, number> = {};
  vendors.forEach((v) => {
    categoryCounts[v.businessType] = (categoryCounts[v.businessType] || 0) + 1;
  });

  const recentVendors = vendors.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Primary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value={totalVendors}
          subtitle="Onboarded in fieldwork"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          trend={`${totalVendors} Saved Records`}
        />
        <StatCard
          title="QR Codes Generated"
          value={qrGeneratedCount}
          subtitle="ISO/IEC 18004 Compliant"
          icon={QrCode}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend="100% Interoperable"
        />
        <StatCard
          title="QR Cards Printed"
          value={cardsPrintedCount}
          subtitle="Counter Standees Delivered"
          icon={Printer}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend="Standee Ready"
        />
        <StatCard
          title="Business Categories"
          value={categoriesCount}
          subtitle="Enterprise Types Onboarded"
          icon={Grid}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          trend="Diverse Coverage"
        />
      </div>

      {/* Fieldwork Impact Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fieldwork Impact Tracker
              </h3>
              <p className="text-xs text-slate-500">
                CEP Target: Onboard {targetCount} micro-vendors for project assessment
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">{progressPercent}%</span>
            <span className="text-xs text-slate-500 font-medium block">
              {totalVendors} of {targetCount} Completed
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
          <span>0 Vendors</span>
          <span>5 Vendors</span>
          <span className="font-bold text-emerald-700">10 Vendors Target</span>
        </div>
      </div>

      {/* Two Column Section: Category Breakdown + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Vendor Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">
              Live breakdown of business types in your log
            </p>

            {Object.keys(categoryCounts).length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No vendors recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / totalVendors) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{cat}</span>
                        <span className="text-slate-900">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onNavigateToVendors}
            className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Vendors List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Vendors</h3>
                <p className="text-xs text-slate-500">Latest micro-merchants registered</p>
              </div>
              <button
                onClick={onNavigateToVendors}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View all ({totalVendors}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentVendors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No vendors added yet</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Start your CEP fieldwork by creating your first vendor QR.
                </p>
                <button
                  onClick={onNavigateToCreate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add First Vendor
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {vendor.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {vendor.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">
                            {vendor.businessType}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{maskVPA(vendor.vpa)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {vendor.amount && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ₹{vendor.amount}
                        </span>
                      )}
                      <button
                        onClick={() => onSelectVendor(vendor)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Standard NPCI upi://pay URI
            </span>
            <span>Stored locally in browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};
