import React from 'react';
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
  Target,
  FileCheck,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" /> Community Engagement Project Documentation
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Helping Small Vendors Go Directly UPI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
          A simple, offline-capable tool that a student volunteer can use in the field to give any small vendor their own scannable UPI QR code within a minute.
        </p>
      </div>

      {/* Grid of Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <HelpCircle className="w-5 h-5" /> Problem Statement
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Many small roadside vendors (tea stalls, vada pav hawkers, kirana shops, food carts) still depend heavily on cash or display third-party QR codes belonging to friends, landlords, or relatives.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Money reaching someone else's account creates settlement delays, accounting confusion, and a loss of financial independence. Furthermore, commercial merchant apps enforce soundbox fees or complex KYC documentation that alienates informal vendors.
          </p>
        </div>

        {/* Solution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <Zap className="w-5 h-5" /> The VendorUPI Solution
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            VendorUPI provides a zero-cost way to generate a direct UPI QR code using the vendor's own Virtual Payment Address (VPA).
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            The volunteer enters the vendor name, business type, UPI ID, and optional amount; the app builds a standard open <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">upi://pay</code> payment link, renders it as a real scannable ISO QR, and produces a printable standee counter card.
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
          <Target className="w-5 h-5" /> Core CEP Objectives
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
          {[
            'Promote digital payments among small local street vendors',
            'Help micro-merchants accept direct UPI payments in their own account',
            'Reduce dependency on third-party proxy payment methods',
            'Make QR code generation simple enough for first-time users',
            'Digitally document fieldwork with verified survey data and feedback',
            'Provide printable counter standees ready for shopfront display',
          ].map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Step Fieldwork Methodology */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <FileCheck className="w-5 h-5 text-emerald-600" /> 7-Step Fieldwork Methodology
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { step: '1', title: 'Identify Vendors', desc: 'Approach local micro-vendors in neighborhood' },
            { step: '2', title: 'Survey Habits', desc: 'Understand their current payment methods' },
            { step: '3', title: 'Collect VPA', desc: 'Collect vendor consent and UPI ID (name@upi)' },
            { step: '4', title: 'Generate QR', desc: 'Build upi://pay URI and ISO scannable QR' },
            { step: '5', title: 'Handover Card', desc: 'Provide printable counter standee' },
            { step: '6', title: 'Test Payment', desc: 'Verify instant bank credit notification' },
            { step: '7', title: 'Record Feedback', desc: 'Capture survey ratings & notes' },
            { step: '8', title: 'Export Report', desc: 'Download CSV for CEP evaluation' },
          ].map((item) => (
            <div key={item.step} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 relative">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center mb-2">
                {item.step}
              </span>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security, Privacy & Disclaimer */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" /> Security & Privacy Assurance
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            • UPI IDs are partially masked in public listings (<code className="text-emerald-400">gup***@oksbi</code>)
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            • Deleting a vendor always requires explicit modal confirmation
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            • No UPI PIN, OTP, password, or banking credential is ever requested or stored
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            • Records live purely inside the volunteer's own browser storage runtime
          </div>
        </div>

        {/* Mandatory Disclaimer Box */}
        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed text-center font-medium">
          “VendorUPI does not process, store, or transfer money. Payments are completed through the customer's selected UPI application.”
        </div>
      </div>
    </div>
  );
};
