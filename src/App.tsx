import { useState, useEffect } from 'react';
import type { NavTab } from './components/Sidebar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { QRDisplay } from './components/QRDisplay';
import { PrintableCard } from './components/PrintableCard';

import { Dashboard } from './pages/Dashboard';
import { CreateQR } from './pages/CreateQR';
import { Vendors } from './pages/Vendors';
import { QRCards } from './pages/QRCards';
import { Statistics } from './pages/Statistics';
import { Feedback } from './pages/Feedback';
import { ExportData } from './pages/ExportData';
import { About } from './pages/About';

import type { Vendor, ToastMessage, VendorFeedback } from './types';
import {
  getStoredVendors,
  saveVendor,
  deleteVendor as removeVendorFromStorage,
  loadDemoData,
  clearDemoData,
  updateVendor,
} from './utils/storage';
import { maskVPA } from './utils/upi';
import { MessageSquarePlus, FileSpreadsheet, Info, Trash2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal States
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [printableVendor, setPrintableVendor] = useState<Vendor | null>(null);
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Initialize Vendors from LocalStorage
  useEffect(() => {
    const loaded = getStoredVendors();
    setVendors(loaded);
  }, []);

  // Toast Helper
  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Vendor Action Handlers
  const handleSaveVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt'>): Vendor => {
    const created = saveVendor(vendorData);
    setVendors(getStoredVendors());
    return created;
  };

  const handleDeleteVendorConfirm = () => {
    if (!deleteVendorId) return;
    const target = vendors.find((v) => v.id === deleteVendorId);
    removeVendorFromStorage(deleteVendorId);
    setVendors(getStoredVendors());
    if (selectedVendor?.id === deleteVendorId) setSelectedVendor(null);
    if (printableVendor?.id === deleteVendorId) setPrintableVendor(null);
    setDeleteVendorId(null);

    showToast(
      'Vendor Deleted',
      target ? `Removed ${target.name} from logs.` : 'Vendor record removed.',
      'info'
    );
  };

  const handleUpdateFeedback = (vendorId: string, feedback: VendorFeedback) => {
    updateVendor(vendorId, { feedback });
    setVendors(getStoredVendors());
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor((prev) => (prev ? { ...prev, feedback } : null));
    }
  };

  const handleLoadDemo = () => {
    const loaded = loadDemoData();
    setVendors(loaded);
  };

  const handleClearDemo = () => {
    const updated = clearDemoData();
    setVendors(updated);
  };

  const hasDemo = vendors.some((v) => v.isDemo);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        vendorCount={vendors.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          activeTab={activeTab}
          onNavigateToCreate={() => setActiveTab('create')}
          onLoadDemoData={handleLoadDemo}
          onClearDemoData={handleClearDemo}
          hasDemoData={hasDemo}
        />

        {/* Page Views Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              vendors={vendors}
              onNavigateToCreate={() => setActiveTab('create')}
              onNavigateToVendors={() => setActiveTab('vendors')}
              onSelectVendor={(v) => setSelectedVendor(v)}
            />
          )}

          {activeTab === 'create' && (
            <CreateQR
              onSaveVendor={handleSaveVendor}
              onOpenPrintableCard={(v) => setPrintableVendor(v)}
              showToast={showToast}
            />
          )}

          {activeTab === 'vendors' && (
            <Vendors
              vendors={vendors}
              onNavigateToCreate={() => setActiveTab('create')}
              onSelectVendor={(v) => setSelectedVendor(v)}
              onOpenPrintableCard={(v) => setPrintableVendor(v)}
              onDeleteVendor={(id) => setDeleteVendorId(id)}
            />
          )}

          {activeTab === 'cards' && (
            <QRCards
              vendors={vendors}
              onNavigateToCreate={() => setActiveTab('create')}
            />
          )}

          {activeTab === 'statistics' && <Statistics vendors={vendors} />}

          {activeTab === 'feedback' && (
            <Feedback
              vendors={vendors}
              onUpdateFeedback={handleUpdateFeedback}
              showToast={showToast}
            />
          )}

          {activeTab === 'export' && (
            <ExportData
              vendors={vendors}
              onLoadDemoData={handleLoadDemo}
              onClearDemoData={handleClearDemo}
              showToast={showToast}
            />
          )}

          {activeTab === 'about' && <About />}
        </main>
      </div>

      {/* Touch-Friendly Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
      />

      {/* Vendor Profile & Details Modal */}
      {selectedVendor && (
        <Modal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          title="Vendor Details & Scannable QR"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedVendor.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  UPI VPA: {maskVPA(selectedVendor.vpa)}
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                {selectedVendor.businessType}
              </span>
            </div>

            {/* QR Preview inside Modal */}
            <QRDisplay
              vendor={selectedVendor}
              onPrintCard={() => {
                const target = selectedVendor;
                setSelectedVendor(null);
                setPrintableVendor(target);
              }}
            />

            {/* Vendor Audit Metadata */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Before VendorUPI:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {selectedVendor.priorPaymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date Registered:</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedVendor.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Standee Prints Count:</span>
                <span className="font-bold text-emerald-700">
                  {selectedVendor.printedCardCount || 0} Prints
                </span>
              </div>
            </div>

            {/* Feedback section inside modal */}
            {selectedVendor.feedback && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-950 block">Recorded Field Feedback:</span>
                <p className="text-slate-700 italic">"{selectedVendor.feedback.notes}"</p>
                <span className="text-[10px] text-emerald-800 font-semibold block pt-1">
                  Rating: {selectedVendor.feedback.rating.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}

            {/* Action controls */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  const targetId = selectedVendor.id;
                  setSelectedVendor(null);
                  setDeleteVendorId(targetId);
                }}
                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Record
              </button>

              <button
                onClick={() => setSelectedVendor(null)}
                className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Standee Printable Card Modal */}
      {printableVendor && (
        <Modal
          isOpen={!!printableVendor}
          onClose={() => setPrintableVendor(null)}
          maxWidth="lg"
        >
          <PrintableCard
            vendor={printableVendor}
            onClose={() => setPrintableVendor(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteVendorId}
        onClose={() => setDeleteVendorId(null)}
        onConfirm={handleDeleteVendorConfirm}
        title="Delete Vendor Record?"
        message="Are you sure you want to remove this vendor from your CEP fieldwork log? This action cannot be undone."
        confirmLabel="Delete Record"
        isDanger={true}
      />

      {/* Mobile More Navigation Menu Modal */}
      {isMoreMenuOpen && (
        <Modal
          isOpen={isMoreMenuOpen}
          onClose={() => setIsMoreMenuOpen(false)}
          title="More Project Options"
          maxWidth="sm"
        >
          <div className="space-y-2">
            {[
              { id: 'feedback' as NavTab, label: 'Fieldwork Feedback', icon: MessageSquarePlus },
              { id: 'export' as NavTab, label: 'Export Data (CSV)', icon: FileSpreadsheet },
              { id: 'about' as NavTab, label: 'About CEP Project', icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMoreMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
