export type BusinessCategory =
  | 'Tea Stall'
  | 'Kirana Shop'
  | 'Fruit Seller'
  | 'Vegetable Seller'
  | 'Food Cart'
  | 'Juice Stall'
  | 'Bakery'
  | 'Other';

export type PaymentMethodBefore =
  | 'cash'
  | 'relative_qr'
  | 'third_party'
  | 'own_qr';

export type SatisfactionRating =
  | 'very_satisfied'
  | 'satisfied'
  | 'neutral'
  | 'not_satisfied';

export interface VendorFeedback {
  id: string;
  vendorId: string;
  priorMethod: PaymentMethodBefore;
  hadOwnQR: boolean;
  easeOfSetup: boolean;
  wouldUseDirectUPI: boolean;
  rating: SatisfactionRating;
  notes: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  businessType: BusinessCategory;
  vpa: string;
  amount?: number | null;
  createdAt: string;
  priorPaymentMethod: PaymentMethodBefore;
  qrGenerated: boolean;
  printedCardCount: number;
  feedback?: VendorFeedback;
  isDemo?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface CEPStats {
  totalVendors: number;
  qrGeneratedCount: number;
  cardsPrintedCount: number;
  categoriesCount: number;
  targetCount: number; // Benchmark 10
  surveyedCount: number;
  cashCount: number;
  proxyQrCount: number;
  ownQrCount: number;
  satisfiedCount: number;
}
