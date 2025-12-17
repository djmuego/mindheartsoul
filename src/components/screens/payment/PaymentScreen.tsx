
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Check, Clock, AlertCircle } from 'lucide-react';
import { useSession } from '../../../context/SessionContext';

import { 
  ApiironeCurrency, 
  generatePaymentAddress, 
  checkAddressBalance,
  getCurrencyName,
  getCurrencySymbol,
  formatCryptoAmount,
  convertUsdToCrypto
} from '../../../services/payments/apironeService';
import { 
  createPayment, 
  markPaymentComplete 
} from '../../../services/payments/paymentsService';
import { PaymentRecord, PaymentPurpose } from '../../../types';
import QRCode from 'qrcode';

const APIRONE_ACCOUNT = import.meta.env.VITE_APIRONE_ACCOUNT || 'demo-account';
const CALLBACK_URL = import.meta.env.VITE_APIRONE_CALLBACK_URL || window.location.origin + '/api/payment-callback';

// Debug: Log Apirone Account ID
console.log('🔑 Apirone Account ID:', APIRONE_ACCOUNT);
console.log('📞 Callback URL:', CALLBACK_URL);

// Simplified currency list with network selection
interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  currencies: ApiironeCurrency[];
  icon?: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    currencies: ['btc'],
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    currencies: ['eth'],
  },
  {
    id: 'usdt',
    name: 'USDT',
    symbol: 'USDT',
    currencies: ['usdt@trx', 'usdt@eth', 'usdt@bnb'], // TRC-20, ERC-20, BEP-20
  },
  {
    id: 'usdc',
    name: 'USDC',
    symbol: 'USDC',
    currencies: ['usdc@trx', 'usdc@eth', 'usdc@bnb'], // TRC-20, ERC-20, BEP-20
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    currencies: ['bnb'],
  },
];

interface PaymentScreenProps {
  purpose?: PaymentPurpose;
  amount?: number; // in USD
  relatedId?: string;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ 
  purpose = 'pro_subscription',
  amount: propAmount,
  relatedId 
}) => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [searchParams] = useSearchParams();

  const [selectedOption, setSelectedOption] = useState<CryptoOption>(CRYPTO_OPTIONS[2]); // USDT by default
  const [selectedNetwork, setSelectedNetwork] = useState<ApiironeCurrency>('usdt@trx'); // TRC-20 by default
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  // Get amount from props or URL params
  const usdAmount = propAmount || parseFloat(searchParams.get('amount') || '9.99');
  const actualPurpose = (searchParams.get('purpose') as PaymentPurpose) || purpose;
  const actualRelatedId = searchParams.get('relatedId') || relatedId;
  const itemTitle = searchParams.get('title') || ''; // For course/booking titles
  const subscriptionPlan = searchParams.get('plan') as 'pro_monthly' | 'pro_yearly' | null; // For subscription

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedNetwork && usdAmount) {
      convertUsdToCrypto(usdAmount, selectedNetwork)
        .then(amount => setCryptoAmount(amount))
        .catch(err => setError(`Failed to convert amount: ${err.message}`));
    }
  }, [selectedNetwork, usdAmount]);

  const handleCreatePayment = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('💰 Creating payment with:', {
        account: APIRONE_ACCOUNT,
        currency: selectedNetwork,
        usdAmount,
        cryptoAmount
      });

      // Create payment record
      const newPayment = createPayment({
        userId: user.id,
        purpose: actualPurpose,
        relatedId: actualRelatedId,
        amount: usdAmount,
        currency: getCurrencySymbol(selectedNetwork) as any,
        provider: 'apirone',
        metadata: {
          cryptoCurrency: selectedNetwork,
          cryptoAmount,
        }
      });

      console.log('✅ Payment record created:', newPayment.id);

      // Generate payment address via Apirone
      console.log('🔗 Generating Apirone address...');
      const addressData = await generatePaymentAddress({
        account: APIRONE_ACCOUNT,
        currency: selectedNetwork,
        callbackUrl: CALLBACK_URL,
        callbackData: {
          paymentId: newPayment.id,
          userId: user.id,
          purpose: actualPurpose,
        }
      });

      console.log('✅ Address generated:', addressData.address);

      setPaymentAddress(addressData.address);
      setPayment(newPayment);

      // Generate QR code
      const qr = await QRCode.toDataURL(addressData.address, { width: 256 });
      setQrCodeUrl(qr);

      console.log('✅ QR code generated');

      // Start checking for payment
      startPaymentCheck(newPayment.id, addressData.address);

    } catch (err: any) {
      console.error('❌ Payment creation failed:', err);
      setError(err.message || 'Failed to create payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startPaymentCheck = (paymentId: string, address: string) => {
    setIsChecking(true);
    console.log('🔍 Starting payment check for address:', address);

    const checkInterval = setInterval(async () => {
      try {
        console.log('⏰ Checking balance...');
        const balance = await checkAddressBalance(APIRONE_ACCOUNT, address, selectedNetwork);
        console.log('💵 Balance:', balance, 'Expected:', cryptoAmount);
        
        if (balance.total >= cryptoAmount) {
          // Payment received!
          console.log('✅ Payment received!');
          clearInterval(checkInterval);
          setIsChecking(false);

          // Mark payment complete
          markPaymentComplete(paymentId);

          // Handle post-payment actions
          handlePaymentSuccess(actualPurpose, actualRelatedId);
        }
      } catch (err) {
        console.error('❌ Balance check error:', err);
      }
    }, 10000); // Check every 10s

    // Stop checking after 1 hour
    setTimeout(() => {
      console.log('⏱️ Payment check timeout (1 hour)');
      clearInterval(checkInterval);
      setIsChecking(false);
    }, 60 * 60 * 1000);
  };

  const handlePaymentSuccess = (purpose: PaymentPurpose, relatedId?: string) => {
    if (purpose === 'pro_subscription') {
      // Import activatePro from subscriptionService
      const { activatePro } = require('../../../services/subscriptionService');
      
      // Activate Pro subscription with plan
      const plan = subscriptionPlan || 'pro_monthly';
      activatePro(user!.id, plan, payment?.id);
      
      navigate('/pro?success=true');
    } else if (purpose === 'booking' && relatedId) {
      // Import confirmBooking from bookingsService
      const { confirmBooking } = require('../../../services/bookingsService');
      
      // Confirm booking
      confirmBooking(relatedId, payment?.id);
      
      // Create notification
      const { addNotification } = require('../../../services/notificationsService');
      addNotification({
        userId: user!.id,
        type: 'booking_confirmed',
        titleKey: 'notifications.bookingConfirmed',
        payload: { bookingId: relatedId }
      });
      
      navigate(`/bookings/${relatedId}?success=true`);
    } else if (purpose === 'course' && relatedId) {
      navigate(`/courses/${relatedId}?success=true`);
    } else {
      navigate('/profile?payment=success');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Address copied!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Crypto Payment</h1>
      </div>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* DEV MODE Warning */}
        {import.meta.env.DEV && !payment && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-600 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎭</div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-1">
                  DEV MODE: Mock Payments Active
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You are in development mode. Payment addresses are <strong>MOCK</strong> (not real).
                  <br />
                  Account ID: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{APIRONE_ACCOUNT}</code>
                  <br />
                  After generating address, click "Simulate Payment" to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!payment ? (
          // Step 1: Select Currency
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Payment Amount</h2>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${usdAmount.toFixed(2)} USD</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {actualPurpose === 'pro_subscription' && 'Pro Subscription - Lifetime Access'}
                {actualPurpose === 'booking' && (itemTitle ? `Session: ${itemTitle}` : 'Session Booking Payment')}
                {actualPurpose === 'course' && (itemTitle ? `Course: ${itemTitle}` : 'Course Purchase')}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Cryptocurrency</h2>
              
              {/* Currency Selection */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {CRYPTO_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedOption(option);
                      setSelectedNetwork(option.currencies[0]); // Auto-select first network
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedOption.id === option.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white text-lg">{option.symbol}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.name}</div>
                  </button>
                ))}
              </div>

              {/* Network Selection (if multiple networks available) */}
              {selectedOption.currencies.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Network:
                  </label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value as ApiironeCurrency)}
                    className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {selectedOption.currencies.map(curr => (
                      <option key={curr} value={curr}>
                        {getCurrencyName(curr)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {cryptoAmount > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-600 dark:text-slate-400">You will pay:</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCryptoAmount(cryptoAmount, selectedNetwork)} {getCurrencySymbol(selectedNetwork)}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreatePayment}
              disabled={isLoading || cryptoAmount === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Payment...' : 'Continue to Payment'}
            </button>
          </div>
        ) : (
          // Step 2: Show Payment Address & QR
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              {isChecking ? (
                <div className="flex items-center space-x-3 text-yellow-600 dark:text-yellow-400 mb-4">
                  <Clock size={20} className="animate-spin" />
                  <span className="font-medium">Waiting for payment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-green-600 dark:text-green-400 mb-4">
                  <Check size={20} />
                  <span className="font-medium">Payment received!</span>
                </div>
              )}

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Send Crypto to This Address</h2>
              
              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 rounded-lg" />
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg break-all">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Payment Address:</div>
                <div className="text-sm font-mono text-slate-900 dark:text-white">{paymentAddress}</div>
              </div>

              <button
                onClick={() => copyToClipboard(paymentAddress)}
                className="mt-3 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Copy Address
              </button>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Amount to send:</strong> {formatCryptoAmount(cryptoAmount, selectedNetwork)} {getCurrencySymbol(selectedNetwork)}
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Network: {getCurrencyName(selectedNetwork)}
                </div>
              </div>

              {/* DEV MODE: Mock payment button */}
              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    if (payment) {
                      console.log('🎭 MOCK: Simulating payment received');
                      markPaymentComplete(payment.id);
                      handlePaymentSuccess(actualPurpose, actualRelatedId);
                    }
                  }}
                  className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  🎭 DEV: Simulate Payment Received
                </button>
              )}
            </div>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              {import.meta.env.DEV ? (
                <>
                  🎭 <strong>DEV MODE:</strong> This is a mock payment address.
                  <br />
                  Click "Simulate Payment Received" to continue.
                </>
              ) : (
                <>
                  Payment will be confirmed automatically after blockchain confirmation.
                  <br />
                  This page will redirect automatically.
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

