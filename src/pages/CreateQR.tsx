import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { BusinessCategory, PaymentMethodBefore, Vendor } from '../types';
import { isValidVPA } from '../utils/upi';
import { playPaymentSound } from '../utils/sound';
import { QRDisplay } from '../components/QRDisplay';

interface CreateQRProps {
  onSaveVendor: (vendorData: Omit<Vendor, 'id' | 'createdAt'>) => Vendor;
  onOpenPrintableCard: (vendor: Vendor) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Tea Stall',
  'Kirana Shop',
  'Fruit Seller',
  'Vegetable Seller',
  'Food Cart',
  'Juice Stall',
  'Bakery',
  'Other',
];

export const CreateQR: React.FC<CreateQRProps> = ({
  onSaveVendor,
  onOpenPrintableCard,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessCategory>('Tea Stall');
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [priorMethod, setPriorMethod] = useState<PaymentMethodBefore>('cash');

  const [generatedVendor, setGeneratedVendor] = useState<Vendor | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Vendor / Business Name is required.';
    }

    if (!vpa.trim()) {
      errs.vpa = 'UPI ID (VPA) is required.';
    } else if (!isValidVPA(vpa)) {
      errs.vpa = 'Please enter a valid UPI ID (e.g. shopname@oksbi).';
    }

    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      errs.amount = 'Fixed amount must be a positive number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedAmount = amount ? parseFloat(amount) : null;

    const saved = onSaveVendor({
      name: name.trim(),
      businessType,
      vpa: vpa.trim().toLowerCase(),
      amount: parsedAmount,
      priorPaymentMethod: priorMethod,
      qrGenerated: true,
      printedCardCount: 0,
    });

    setGeneratedVendor(saved);
    playPaymentSound(saved.name);
    showToast(
      'UPI QR Created Successfully!',
      `Generated direct payment QR for ${saved.name}.`,
      'success'
    );
  };

  const handleRegenerate = () => {
    setGeneratedVendor(null);
  };

  const handleClear = () => {
    setName('');
    setVpa('');
    setAmount('');
    setBusinessType('Tea Stall');
    setPriorMethod('cash');
    setGeneratedVendor(null);
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> 1-Minute Onboarding Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Generate Direct UPI QR Code
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Enter vendor name, business type, and VPA to create an instant scannable QR card.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {generatedVendor && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reset Form
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vendor Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Vendor Name */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Vendor / Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter vendor name (e.g. Ahmed Tea Stall)"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.name
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Business Type / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessCategory)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* UPI ID (VPA) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Vendor UPI ID (VPA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="vendorname@upi (e.g. ahmedtea@oksbi)"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-all ${
                  errors.vpa
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Example handles: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">@oksbi</code>, <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">@ybl</code>, <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">@paytm</code>, <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">@okaxis</code>
              </p>
              {errors.vpa && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.vpa}
                </p>
              )}
            </div>

            {/* Fixed Payment Amount (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Fixed Amount (Optional - INR ₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Leave empty if customer enters amount in app"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.amount
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              <p className="text-xs text-slate-400 mt-1">
                Leave empty if customer should enter the payment amount in their UPI app.
              </p>
              {errors.amount && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Prior Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Payment Method Before VendorUPI (Survey Metric)
              </label>
              <select
                value={priorMethod}
                onChange={(e) => setPriorMethod(e.target.value as PaymentMethodBefore)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="cash">Cash Only</option>
                <option value="relative_qr">Relative / Family Member's QR</option>
                <option value="third_party">Third-Party / Friend's QR</option>
                <option value="own_qr">Already Had Own QR (Damaged / Faded)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <QrCode className="w-5 h-5 stroke-[2.5]" />
                <span>Generate UPI QR Code</span>
              </button>

              {generatedVendor && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Edit Details
                </button>
              )}
            </div>
          </form>

          {/* Safety Disclaimer */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Liability Safety:</strong> VendorUPI only creates standard ISO QR payment codes. We never ask for PINs, passwords, or banking credentials, and we never process money.
            </span>
          </div>
        </div>

        {/* Right Column: Live QR Preview Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
            <div className="flex items-center justify-between mb-4 text-left">
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Payment Preview</h3>
                <p className="text-xs text-slate-500">Real ISO/IEC 18004 Scannable QR</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
                Interoperable
              </span>
            </div>

            {generatedVendor ? (
              <QRDisplay
                vendor={generatedVendor}
                onPrintCard={() => onOpenPrintableCard(generatedVendor)}
              />
            ) : (
              <div className="py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                <QrCode className="w-16 h-16 text-slate-300 mb-3 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-slate-700">Your QR appears here</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Fill in the vendor form on the left and click "Generate UPI QR" to produce a real scannable payment card.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
