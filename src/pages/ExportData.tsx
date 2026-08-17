import React from 'react';
import { FileSpreadsheet, Download, RefreshCw, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { Vendor } from '../types';
import { exportVendorsToCSV } from '../utils/exportCsv';

interface ExportDataProps {
  vendors: Vendor[];
  onLoadDemoData: () => void;
  onClearDemoData: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExportData: React.FC<ExportDataProps> = ({
  vendors,
  onLoadDemoData,
  onClearDemoData,
  showToast,
}) => {
  const handleExport = () => {
    exportVendorsToCSV(vendors);
    showToast(
      'CSV Exported Successfully!',
      'Vendor fieldwork records downloaded as vendor_fieldwork_data.csv.',
      'success'
    );
  };

  const hasDemo = vendors.some((v) => v.isDemo);
  const feedbackCount = vendors.filter((v) => v.feedback).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <FileSpreadsheet className="w-4 h-4" /> Academic CEP Audit Exporter
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Export Fieldwork Data
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Download your complete fieldwork log as a spreadsheet-ready CSV file for project evaluation.
        </p>
      </div>

      {/* Main Export Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Vendor Records Ready for Export
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong>{vendors.length}</strong> total records • <strong>{feedbackCount}</strong> with feedback survey • <strong>{vendors.filter(v => v.isDemo).length}</strong> sample demo entries
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={vendors.length === 0}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" /> Export CSV Spreadsheet
          </button>
        </div>

        {/* Columns Included List */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Columns Included in Export File:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-700">
            {[
              'ID & Record UUID',
              'Vendor / Business Name',
              'Business Category Type',
              'UPI VPA Address',
              'Fixed Amount (INR)',
              'Prior Payment Method',
              'QR Generated Status',
              'Printed Cards Count',
              'Feedback Rating',
              'Qualitative Survey Notes',
              'Date & Time Added',
              'Demo Data Indicator',
            ].map((col) => (
              <div
                key={col}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200/60"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{col}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Data Management Box */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Presentation Demo Data Manager</h4>
            {hasDemo ? (
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
                Demo Data Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full">
                Clean Real State
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Load six clearly-labelled sample vendors for presentation demonstrations, or clear them so only real fieldwork records remain.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                onLoadDemoData();
                showToast('Demo Data Loaded', 'Populated 6 sample vendor records.', 'info');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Load 6 Demo Records
            </button>

            {hasDemo && (
              <button
                onClick={() => {
                  onClearDemoData();
                  showToast('Demo Data Cleared', 'Removed sample records.', 'info');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Clear Demo Data
              </button>
            )}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2.5 p-4 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Records are stored strictly in this browser runtime. VendorUPI never requests or stores UPI passwords, PINs, or banking credentials, and does not process, store, or transfer money.
          </span>
        </div>
      </div>
    </div>
  );
};
