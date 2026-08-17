import React, { useState } from 'react';
import { MessageSquarePlus, Store, Send } from 'lucide-react';
import type { Vendor, VendorFeedback, SatisfactionRating, PaymentMethodBefore } from '../types';

interface FeedbackProps {
  vendors: Vendor[];
  onUpdateFeedback: (vendorId: string, feedback: VendorFeedback) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  vendors,
  onUpdateFeedback,
  showToast,
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendors.length > 0 ? vendors[0].id : ''
  );
  const [priorMethod] = useState<PaymentMethodBefore>('cash');
  const [hadOwnQR] = useState<boolean>(false);
  const [easeOfSetup, setEaseOfSetup] = useState<boolean>(true);
  const [wouldUseDirectUPI, setWouldUseDirectUPI] = useState<boolean>(true);
  const [rating, setRating] = useState<SatisfactionRating>('very_satisfied');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorId) {
      showToast('Vendor Required', 'Please select a vendor to submit feedback.', 'error');
      return;
    }

    const feedbackObj: VendorFeedback = {
      id: 'fb-' + Date.now(),
      vendorId: selectedVendorId,
      priorMethod,
      hadOwnQR,
      easeOfSetup,
      wouldUseDirectUPI,
      rating,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onUpdateFeedback(selectedVendorId, feedbackObj);
    showToast('Feedback Saved', 'Micro-merchant fieldwork feedback successfully recorded!', 'success');
    setNotes('');
  };

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <MessageSquarePlus className="w-4 h-4" /> Fieldwork Audit Form
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Fieldwork Feedback & Survey Collection
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Capture micro-merchant satisfaction, setup ease, and post-onboarding qualitative responses.
        </p>
      </div>

      {vendors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No vendors to review yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Add a vendor first, then record their fieldwork survey feedback here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Feedback Form (7 Cols) */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5"
          >
            {/* Vendor Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Select Vendor <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.businessType})
                  </option>
                ))}
              </select>
            </div>

            {/* Satisfaction Rating Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Vendor Satisfaction Rating <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'very_satisfied', label: 'Very Satisfied', icon: '😍' },
                  { id: 'satisfied', label: 'Satisfied', icon: '😊' },
                  { id: 'neutral', label: 'Neutral', icon: '😐' },
                  { id: 'not_satisfied', label: 'Not Satisfied', icon: '😟' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRating(item.id as SatisfactionRating)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      rating === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Setup Ease Questions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">
                  Was QR code generation easy for the vendor?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEaseOfSetup(true)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      easeOfSetup
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEaseOfSetup(false)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      !easeOfSetup
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">
                  Would the vendor continue using direct UPI payments?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setWouldUseDirectUPI(true)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      wouldUseDirectUPI
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldUseDirectUPI(false)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      !wouldUseDirectUPI
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Qualitative Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Fieldwork Notes & Vendor Feedback
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter field comments (e.g. Vendor found direct QR easy to display at tea counter...)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Save Fieldwork Feedback
            </button>
          </form>

          {/* Feedback Audit View (5 Cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Existing Feedback Log</h3>

            {selectedVendor?.feedback ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    {selectedVendor.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedVendor.feedback.rating.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                  "{selectedVendor.feedback.notes || 'No qualitative comments recorded.'}"
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div>
                    Setup Ease: <strong>{selectedVendor.feedback.easeOfSetup ? 'Easy' : 'Difficult'}</strong>
                  </div>
                  <div>
                    Direct UPI Usage: <strong>{selectedVendor.feedback.wouldUseDirectUPI ? 'Yes' : 'No'}</strong>
                  </div>
                  <div>
                    Date Recorded:{' '}
                    <strong>
                      {new Date(selectedVendor.feedback.createdAt).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No feedback recorded yet for selected vendor.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
