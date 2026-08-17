import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy, Check, Sparkles, Volume2 } from 'lucide-react';
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

  const upiUri = buildUPIPayURI({
    vpa: vendor.vpa,
    name: vendor.name,
    amount: vendor.amount,
  });

  const handleCopyUri = () => {
    navigator.clipboard.writeText(upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleDownloadPNG = () => {
    triggerConfetti();
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
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${vendor.name.replace(/\s+/g, '_')}_UPI_QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center">
      {/* SaaS Premium Card Preview */}
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden group">
        {/* Background glow effects */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
              VU
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                VendorUPI
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">
                Direct Payments
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {vendor.businessType}
          </span>
        </div>

        {/* QR Canvas Box */}
        <div
          ref={qrRef}
          className="bg-white p-5 rounded-2xl shadow-inner flex flex-col items-center justify-center my-2 border border-slate-200/50 relative"
        >
          <QRCodeSVG
            value={upiUri}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> SCAN & PAY
            </span>
          </div>
        </div>

        {/* Vendor Info Details */}
        <div className="text-center mt-3">
          <h3 className="text-lg font-bold text-white leading-snug tracking-tight">
            {vendor.name}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 break-all bg-slate-800/60 py-1 px-3 rounded-lg border border-slate-700/50 inline-block">
            UPI: {vendor.vpa}
          </p>

          {vendor.amount ? (
            <div className="mt-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">
              Fixed Amount: ₹{vendor.amount.toFixed(2)}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 mt-2">
              Scan with any compatible UPI app (GPay, PhonePe, Paytm, BHIM)
            </p>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
          Direct NPCI UPI Transfer • Zero Transaction Fee
        </div>
      </div>

      {/* Action Buttons */}
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
            title="Copy UPI Payment Intent URI"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={playPaymentSound}
            className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-medium transition-all active:scale-95"
            title="Play Payment Received Sound (Soundbox Demo)"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
