import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy, Check, Sparkles, Volume2, Wifi, IndianRupee, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { buildUPIPayURI } from '../utils/upi';
import { playPaymentSound } from '../utils/sound';
import type { Vendor } from '../types';

interface QRDisplayProps {
  vendor: Vendor;
  onPrintCard?: () => void;
  showActions?: boolean;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  vendor,
  onPrintCard,
  showActions = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // ── Payment Simulator State ──
  const [simMode, setSimMode] = useState<'idle' | 'waiting' | 'received'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [simAmount, setSimAmount] = useState<string>(
    vendor.amount ? String(vendor.amount) : '50'
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const upiUri = buildUPIPayURI({
    vpa: vendor.vpa,
    name: vendor.name,
    amount: vendor.amount,
  });

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startPaymentSimulation = () => {
    setSimMode('waiting');
    setCountdown(5);

    // Count down 5 → 0
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // After 5s → trigger payment received
    timerRef.current = setTimeout(() => {
      triggerPaymentReceived();
    }, 5000);
  };

  const triggerPaymentReceived = () => {
    setSimMode('received');

    // 🔊 Soundbox announcement
    const amt = parseFloat(simAmount) || undefined;
    playPaymentSound(vendor.name, amt ?? null);

    // 🎉 Confetti burst
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    // Auto reset after 8 seconds
    setTimeout(() => setSimMode('idle'), 8000);
  };

  const cancelSimulation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimMode('idle');
    setCountdown(5);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${vendor.name.replace(/\s+/g, '_')}_UPI_QR.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── Payment Received Notification Banner ── */}
      {simMode === 'received' && (
        <div className="w-full max-w-sm mb-4 animate-bounce-once">
          <div className="bg-emerald-500 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-500/40 border border-emerald-400 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm leading-none">💰 Payment Received!</p>
              <p className="text-xs text-emerald-100 mt-0.5 font-semibold">
                ₹{simAmount} credited to {vendor.name}
              </p>
              <p className="text-[10px] text-emerald-200 font-mono mt-0.5 truncate">
                via UPI • {vendor.vpa}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-xl">₹{simAmount}</p>
              <p className="text-[10px] text-emerald-200">Just now</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Waiting Banner ── */}
      {simMode === 'waiting' && (
        <div className="w-full max-w-sm mb-4">
          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping inline-block" />
              <Wifi className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Waiting for Customer Payment...</p>
              <p className="text-[10px] text-amber-700">
                Simulating payment in <strong>{countdown}s</strong>
              </p>
            </div>
            <button
              onClick={cancelSimulation}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-2 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Premium Dark QR Card ── */}
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">VU</div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">VendorUPI</span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Direct Payments</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {vendor.businessType}
          </span>
        </div>

        <div ref={qrRef} className="bg-white p-5 rounded-2xl shadow-inner flex flex-col items-center my-2 border border-slate-200/50">
          <QRCodeSVG value={upiUri} size={200} level="H" includeMargin={true} />
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> SCAN &amp; PAY
            </span>
          </div>
        </div>

        <div className="text-center mt-3">
          <h3 className="text-lg font-bold text-white leading-snug">{vendor.name}</h3>
          <p className="text-xs text-slate-400 font-mono mt-1 break-all bg-slate-800/60 py-1 px-3 rounded-lg border border-slate-700/50 inline-block">
            UPI: {vendor.vpa}
          </p>
          {vendor.amount ? (
            <div className="mt-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">
              Fixed Amount: ₹{vendor.amount.toFixed(2)}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 mt-2">Scan with GPay, PhonePe, Paytm, BHIM</p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
          Direct NPCI UPI Transfer • Zero Transaction Fee
        </div>
      </div>

      {/* ── Payment Simulator Panel ── */}
      {simMode === 'idle' && (
        <div className="w-full max-w-sm mt-4 bg-slate-900 rounded-2xl p-4 border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Payment Soundbox Simulator
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <input
                type="number"
                value={simAmount}
                onChange={e => setSimAmount(e.target.value)}
                placeholder="Amount"
                className="bg-transparent text-white text-sm font-bold w-full focus:outline-none placeholder-slate-500"
                min="1"
              />
            </div>

            <button
              onClick={startPaymentSimulation}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30 whitespace-nowrap"
            >
              🔊 Simulate Pay
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            Simulates customer scanning QR → payment arrives → soundbox announces!
          </p>
        </div>
      )}

      {/* ── Action Buttons ── */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full max-w-sm">
          <button
            onClick={handleDownloadPNG}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Download QR
          </button>

          {onPrintCard && (
            <button
              onClick={onPrintCard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" /> Print Card
            </button>
          )}

          <button
            onClick={handleCopyUri}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-all"
            title="Copy UPI URI"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => playPaymentSound(vendor.name, vendor.amount)}
            className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-medium transition-all active:scale-95"
            title="🔊 Play Payment Soundbox"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
