import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { buildUPIPayURI } from '../utils/upi';
import type { Vendor } from '../types';

interface PrintableCardProps {
  vendor: Vendor;
  onClose?: () => void;
}

export const PrintableCard: React.FC<PrintableCardProps> = ({ vendor, onClose }) => {
  const upiUri = buildUPIPayURI({
    vpa: vendor.vpa,
    name: vendor.name,
    amount: vendor.amount,
  });

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Action Bar (Hidden during print) */}
      <div className="no-print w-full flex items-center justify-between gap-3 mb-6 p-4 bg-slate-100 rounded-2xl border border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Counter Display Standee</h4>
          <p className="text-xs text-slate-500">Ready for A4 / A5 printing and counter display</p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          )}
          <button
            onClick={handleTriggerPrint}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Shop Card
          </button>
        </div>
      </div>

      {/* Actual Printable Standee Layout Container */}
      <div className="printable-standee-container w-full max-w-md bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center justify-between relative overflow-hidden my-2">
        {/* Top Header Badge */}
        <div className="w-full border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
              VU
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 block leading-tight">
                VendorUPI
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Direct Payments
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300">
              {vendor.businessType}
            </span>
          </div>
        </div>

        {/* Shop Name */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {vendor.name}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">
            Official Payment QR
          </p>
        </div>

        {/* Large ISO QR Code Box */}
        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-md my-2 inline-block">
          <QRCodeSVG
            value={upiUri}
            size={240}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* SCAN & PAY Banner */}
        <div className="my-3 w-full bg-slate-900 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm tracking-wider uppercase shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" /> SCAN & PAY WITH ANY UPI APP
        </div>

        {/* VPA and Amount Details */}
        <div className="w-full my-2 bg-slate-100/80 p-3 rounded-xl border border-slate-300 text-center">
          <p className="text-xs font-mono font-bold text-slate-800 break-all">
            UPI ID: {vendor.vpa}
          </p>
          {vendor.amount ? (
            <p className="text-sm font-black text-emerald-700 mt-1">
              Fixed Transaction Amount: ₹{vendor.amount.toFixed(2)}
            </p>
          ) : (
            <p className="text-[11px] text-slate-600 mt-0.5">
              Customer can enter payment amount in app
            </p>
          )}
        </div>

        {/* Supported Payment Logos / App Text */}
        <div className="w-full mt-4 pt-3 border-t-2 border-dashed border-slate-300">
          <p className="text-[11px] font-bold text-slate-700 mb-2">
            Accepted via Google Pay • PhonePe • Paytm • BHIM • Amazon Pay
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Helping Small Vendors Go Directly UPI — CEP Project</span>
          </div>
        </div>
      </div>
    </div>
  );
};
