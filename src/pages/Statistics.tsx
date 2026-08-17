import React from 'react';
import { BarChart3, Target } from 'lucide-react';
import type { Vendor } from '../types';

interface StatisticsProps {
  vendors: Vendor[];
}

export const Statistics: React.FC<StatisticsProps> = ({ vendors }) => {
  const totalVendors = vendors.length;
  const qrGeneratedCount = vendors.filter((v) => v.qrGenerated).length;

  // Breakdown of prior payment methods
  const cashCount = vendors.filter((v) => v.priorPaymentMethod === 'cash').length;
  const relativeQrCount = vendors.filter((v) => v.priorPaymentMethod === 'relative_qr').length;
  const thirdPartyCount = vendors.filter((v) => v.priorPaymentMethod === 'third_party').length;
  const ownQrCount = vendors.filter((v) => v.priorPaymentMethod === 'own_qr').length;

  // Feedback statistics
  const satisfiedCount = vendors.filter(
    (v) => v.feedback?.rating === 'very_satisfied' || v.feedback?.rating === 'satisfied'
  ).length;

  const targetCount = 10;
  const progressPct = Math.min(100, Math.round((totalVendors / targetCount) * 100));

  // Category counts
  const categoryCounts: Record<string, number> = {};
  vendors.forEach((v) => {
    categoryCounts[v.businessType] = (categoryCounts[v.businessType] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" /> Academic CEP Fieldwork Audit
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Fieldwork Analytics & Impact Metrics
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Real-time metrics calculated dynamically from saved micro-merchant records.
        </p>
      </div>

      {/* 6 Key Survey Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Vendors Surveyed
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalVendors}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
            Used Cash Only
          </p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{cashCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Proxy / Relative QR
          </p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">
            {relativeQrCount + thirdPartyCount}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
            Had Own QR
          </p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">{ownQrCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
            QR Codes Generated
          </p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{qrGeneratedCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
            Satisfied Vendors
          </p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">{satisfiedCount}</h3>
        </div>
      </div>

      {/* Two Main Visual Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Before VendorUPI */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Payment Method Before VendorUPI
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Prior payment dependence recorded during initial survey visits
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Cash Only (No Digital Option)</span>
                <span className="text-slate-900">
                  {cashCount} ({totalVendors ? Math.round((cashCount / totalVendors) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${totalVendors ? (cashCount / totalVendors) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Relative / Family Member's QR</span>
                <span className="text-slate-900">
                  {relativeQrCount} ({totalVendors ? Math.round((relativeQrCount / totalVendors) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${totalVendors ? (relativeQrCount / totalVendors) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Third-Party / Landlord QR</span>
                <span className="text-slate-900">
                  {thirdPartyCount} ({totalVendors ? Math.round((thirdPartyCount / totalVendors) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${totalVendors ? (thirdPartyCount / totalVendors) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Already Had Own QR (Damaged)</span>
                <span className="text-slate-900">
                  {ownQrCount} ({totalVendors ? Math.round((ownQrCount / totalVendors) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${totalVendors ? (ownQrCount / totalVendors) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vendors by Business Type */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Vendors by Business Category
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Enterprise types covered during CEP field visits
          </p>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalVendors ? Math.round((count / totalVendors) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fieldwork Target Tracker Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
              <Target className="w-4 h-4" /> Academic CEP Benchmark Goal
            </div>
            <h3 className="text-2xl font-black text-white">
              Fieldwork Progress: {progressPct}% Completed
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Target goal of 10 onboarded micro-vendors for Community Engagement Project submission.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shrink-0">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-semibold">Target</span>
              <span className="text-2xl font-black text-white">{targetCount}</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-semibold">Completed</span>
              <span className="text-2xl font-black text-emerald-400">{totalVendors}</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-semibold">Remaining</span>
              <span className="text-2xl font-black text-amber-400">
                {Math.max(0, targetCount - totalVendors)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
