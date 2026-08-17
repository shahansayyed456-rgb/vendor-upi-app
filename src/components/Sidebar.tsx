import React from 'react';
import {
  LayoutDashboard,
  QrCode,
  Store,
  CreditCard,
  BarChart3,
  MessageSquarePlus,
  FileSpreadsheet,
  Info,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'create'
  | 'vendors'
  | 'cards'
  | 'statistics'
  | 'feedback'
  | 'export'
  | 'about';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  vendorCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  vendorCount,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create' as NavTab, label: 'Create QR', icon: QrCode, highlight: true },
    { id: 'vendors' as NavTab, label: 'Vendors', icon: Store, badge: vendorCount },
    { id: 'cards' as NavTab, label: 'QR Cards', icon: CreditCard },
    { id: 'statistics' as NavTab, label: 'Statistics', icon: BarChart3 },
    { id: 'feedback' as NavTab, label: 'Feedback', icon: MessageSquarePlus },
    { id: 'export' as NavTab, label: 'Export Data', icon: FileSpreadsheet },
    { id: 'about' as NavTab, label: 'About Project', icon: Info },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen p-4 border-r border-slate-800 sticky top-0 h-screen select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/20">
          VU
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">
            VendorUPI
          </h1>
          <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
            Direct UPI Payments
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Project Footer Box */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
            <ShieldCheck className="w-4 h-4" /> CEP Project Module
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-snug">
            Helping Small Vendors Go Directly UPI
          </p>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Fieldwork
          </div>
        </div>
      </div>
    </aside>
  );
};
