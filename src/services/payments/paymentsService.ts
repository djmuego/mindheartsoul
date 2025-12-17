
import { PaymentRecord, PaymentProvider, PaymentCurrency, PaymentPurpose } from '../../types';
import { storage, STORAGE_KEYS } from '../storage';

/**
 * Payments Service
 * 
 * Manages all payment records (Apirone, Stripe, PayPal)
 */

export function createPayment(data: {
  userId: string;
  purpose: PaymentPurpose;
  relatedId?: string;
  amount: number;
  currency: PaymentCurrency;
  provider: PaymentProvider;
  paymentAddress?: string;
  metadata?: Record<string, any>;
}): PaymentRecord {
  const payment: PaymentRecord = {
    id: generatePaymentId(),
    ...data,
    status: 'pending',
    createdAtIso: new Date().toISOString(),
    expiresAtIso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
  };

  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  payments.push(payment);
  storage.setJSON(STORAGE_KEYS.PAYMENTS_DB, payments);

  return payment;
}

export function updatePayment(paymentId: string, updates: Partial<PaymentRecord>): PaymentRecord | null {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  const index = payments.findIndex(p => p.id === paymentId);
  
  if (index === -1) return null;

  payments[index] = { ...payments[index], ...updates };
  storage.setJSON(STORAGE_KEYS.PAYMENTS_DB, payments);

  return payments[index];
}

export function getPaymentById(paymentId: string): PaymentRecord | null {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  return payments.find(p => p.id === paymentId) || null;
}

export function getPaymentsByUser(userId: string): PaymentRecord[] {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  return payments.filter(p => p.userId === userId).sort((a, b) => 
    new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime()
  );
}

export function getPaymentByRelatedId(relatedId: string, purpose: PaymentPurpose): PaymentRecord | null {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  return payments.find(p => p.relatedId === relatedId && p.purpose === purpose && p.status === 'succeeded') || null;
}

export function markPaymentComplete(paymentId: string, txHash?: string): PaymentRecord | null {
  return updatePayment(paymentId, {
    status: 'succeeded',
    completedAtIso: new Date().toISOString(),
    txHash,
  });
}

export function markPaymentFailed(paymentId: string, reason?: string): PaymentRecord | null {
  return updatePayment(paymentId, {
    status: 'failed',
    metadata: { ...getPaymentById(paymentId)?.metadata, failureReason: reason },
  });
}

export function getAllPayments(): PaymentRecord[] {
  return storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
}

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if payment is expired
 */
export function isPaymentExpired(payment: PaymentRecord): boolean {
  if (!payment.expiresAtIso) return false;
  return new Date(payment.expiresAtIso).getTime() < Date.now();
}

/**
 * Gets active payment for user purpose
 */
export function getActivePayment(userId: string, purpose: PaymentPurpose, relatedId?: string): PaymentRecord | null {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS_DB, []);
  return payments.find(p => 
    p.userId === userId && 
    p.purpose === purpose && 
    p.relatedId === relatedId &&
    (p.status === 'pending' || p.status === 'processing') &&
    !isPaymentExpired(p)
  ) || null;
}
