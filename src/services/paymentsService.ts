
import { PaymentRecord } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const processPayment = async (
  userId: string, 
  bookingId: string, 
  amount: number, 
  currency = 'USD'
): Promise<PaymentRecord> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const record: PaymentRecord = {
    id: `pay_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    bookingId,
    amount,
    currency,
    provider: 'stripe_stub',
    status: 'succeeded',
    createdAtIso: new Date().toISOString()
  };

  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  payments.push(record);
  storage.setJSON(STORAGE_KEYS.PAYMENTS, payments);

  return record;
};

export const getBookingPayment = (bookingId: string): PaymentRecord | undefined => {
  const payments = storage.getJSON<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  return payments.find(p => p.bookingId === bookingId && p.status === 'succeeded');
};
