import type { Vendor } from '../types';

const STORAGE_KEY = 'vendorupi_vendors_v2';

export const INITIAL_DEMO_VENDORS: Vendor[] = [
  {
    id: 'demo-101',
    name: 'Gupta Ji Chai Corner',
    businessType: 'Tea Stall',
    vpa: 'guptaji.tea@oksbi',
    amount: 15,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    priorPaymentMethod: 'cash',
    qrGenerated: true,
    printedCardCount: 2,
    isDemo: true,
    feedback: {
      id: 'fb-101',
      vendorId: 'demo-101',
      priorMethod: 'cash',
      hadOwnQR: false,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'very_satisfied',
      notes: 'Vendor found direct QR very easy to display at tea counter. Customers pay Rs 15 directly to his SBI bank account.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  },
  {
    id: 'demo-102',
    name: 'Mittal Fast Food & Snacks',
    businessType: 'Food Cart',
    vpa: 'mittal.snacks@ybl',
    amount: null,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    priorPaymentMethod: 'relative_qr',
    qrGenerated: true,
    printedCardCount: 1,
    isDemo: true,
    feedback: {
      id: 'fb-102',
      vendorId: 'demo-102',
      priorMethod: 'relative_qr',
      hadOwnQR: false,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'very_satisfied',
      notes: 'Previously used landlord QR code. Happy to receive direct PhonePe/Paytm money into his personal account.',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  },
  {
    id: 'demo-103',
    name: 'Sai Kirana & General Store',
    businessType: 'Kirana Shop',
    vpa: 'saikirana.malad@paytm',
    amount: null,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    priorPaymentMethod: 'own_qr',
    qrGenerated: true,
    printedCardCount: 3,
    isDemo: true,
    feedback: {
      id: 'fb-103',
      vendorId: 'demo-103',
      priorMethod: 'own_qr',
      hadOwnQR: true,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'satisfied',
      notes: 'Old QR printout was damaged. Generated a clean standee card for the counter.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  },
  {
    id: 'demo-104',
    name: 'Om Sai Juice Centre',
    businessType: 'Juice Stall',
    vpa: 'omjuice.fresh@okicici',
    amount: 40,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    priorPaymentMethod: 'cash',
    qrGenerated: true,
    printedCardCount: 1,
    isDemo: true,
    feedback: {
      id: 'fb-104',
      vendorId: 'demo-104',
      priorMethod: 'cash',
      hadOwnQR: false,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'very_satisfied',
      notes: 'Fixed amount Rs 40 QR code speeds up payment during busy morning hours.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  },
  {
    id: 'demo-105',
    name: 'Ganesh Vada Pav Center',
    businessType: 'Food Cart',
    vpa: 'ganeshvadapav@upl',
    amount: 20,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    priorPaymentMethod: 'third_party',
    qrGenerated: true,
    printedCardCount: 2,
    isDemo: true,
    feedback: {
      id: 'fb-105',
      vendorId: 'demo-105',
      priorMethod: 'third_party',
      hadOwnQR: false,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'very_satisfied',
      notes: 'Eliminated reliance on friend account. Instant bank credit received.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  },
  {
    id: 'demo-106',
    name: 'Laxmi Fresh Vegetables',
    businessType: 'Vegetable Seller',
    vpa: 'laxmiveg.malad@postbank',
    amount: null,
    createdAt: new Date().toISOString(),
    priorPaymentMethod: 'cash',
    qrGenerated: true,
    printedCardCount: 1,
    isDemo: true,
    feedback: {
      id: 'fb-106',
      vendorId: 'demo-106',
      priorMethod: 'cash',
      hadOwnQR: false,
      easeOfSetup: true,
      wouldUseDirectUPI: true,
      rating: 'satisfied',
      notes: 'Handed over printed QR card. Scanned successfully on GPay and PhonePe.',
      createdAt: new Date().toISOString(),
    },
  },
];

export function getStoredVendors(): Vendor[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_VENDORS));
      return INITIAL_DEMO_VENDORS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse vendors from localStorage:', error);
    return INITIAL_DEMO_VENDORS;
  }
}

export function saveVendor(vendor: Omit<Vendor, 'id' | 'createdAt'>): Vendor {
  const vendors = getStoredVendors();
  const newVendor: Vendor = {
    ...vendor,
    id: 'vnd-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
    qrGenerated: true,
    printedCardCount: vendor.printedCardCount || 0,
  };

  const updated = [newVendor, ...vendors];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newVendor;
}

export function updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
  const vendors = getStoredVendors();
  const index = vendors.findIndex((v) => v.id === id);
  if (index === -1) return null;

  vendors[index] = { ...vendors[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  return vendors[index];
}

export function deleteVendor(id: string): boolean {
  const vendors = getStoredVendors();
  const filtered = vendors.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function loadDemoData(): Vendor[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_VENDORS));
  return INITIAL_DEMO_VENDORS;
}

export function clearDemoData(): Vendor[] {
  const vendors = getStoredVendors();
  const nonDemo = vendors.filter((v) => !v.isDemo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nonDemo));
  return nonDemo;
}

export function clearAllData(): Vendor[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}
