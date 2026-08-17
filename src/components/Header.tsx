import React from 'react';
import { Plus, Sparkles, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import type { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onNavigateToCreate: () => void;
  onLoadDemoData: () => void;
  onClearDemoData: () => void;
  hasDemoData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigateToCreate,
  onLoadDemoData,
  onClearDemoData,
  hasDemoData,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Good morning 👋',
      subtitle: 'Manage vendor QR codes and track your fieldwork.',
    },
    create: {
      title: 'Create UPI QR Code',
      subtitle: 'Enter vendor details to generate a scannable payment QR.',
    },
    vendors: {
      title: 'Vendor Directory',
      subtitle: 'Manage, filter, and inspect registered micro-vendors.',
    },
    cards: {
      title: 'Printable Counter Cards',
      subtitle: 'Generate standee display cards ready for counter placement.',
    },
    statistics: {
      title: 'Fieldwork Statistics',
      subtitle: 'Real-time analytics and CEP survey progress charts.',
    },
    feedback: {
      title: 'Fieldwork Feedback',
      subtitle: 'Record vendor survey responses and satisfaction ratings.',
    },
    export: {
      title: 'Export Field Data',
      subtitle: 'Download spreadsheet CSV records for academic report audit.',
    },
    about: {
      title: 'About the Project',
      subtitle: 'Community Engagement Project (CEP) documentation & security policy.',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {current.title}
            </h1>
            {activeTab === 'dashboard' && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3 h-3" /> Live Fieldwork
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {current.subtitle}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {hasDemoData ? (
            <button
              onClick={onClearDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
              title="Clear Demo Data"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Clear Demo Data
            </button>
          ) : (
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors border border-indigo-200"
              title="Load 6 Demo Records"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Load Demo Data
            </button>
          )}

          {activeTab !== 'create' && (
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Vendor QR</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner on Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Help local businesses accept direct digital payments.
              </h4>
              <p className="text-[11px] text-slate-300">
                Add Vendor → Enter UPI ID → Generate QR → Download / Print → Give QR to Vendor.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToCreate}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-center"
          >
            Create Vendor QR →
          </button>
        </div>
      )}
    </header>
  );
};
