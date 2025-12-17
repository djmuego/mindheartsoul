
/**
 * Apirone Payment Service
 * 
 * Supports multiple cryptocurrencies:
 * - Bitcoin (BTC)
 * - Ethereum (ETH), USDT@ETH, USDC@ETH
 * - Tron (TRX), USDT@TRX, USDC@TRX
 * - Binance (BNB), USDT@BNB, USDC@BNB
 * - Litecoin (LTC)
 * - Bitcoin Cash (BCH)
 * - Dogecoin (DOGE)
 */

const APIRONE_BASE_URL = 'https://apirone.com/api/v2';

// Mock mode for development (CORS issues in browser)
// In production, requests should go through your backend
// FORCE MOCK in dev to bypass CORS issues
const USE_MOCK = true; // Always use mock in browser (no CORS issues)

console.log('🔧 Apirone Mode:', USE_MOCK ? 'MOCK (dev) - CORS bypass' : 'REAL API');

export type ApiironeCurrency = 
  | 'btc' 
  | 'eth' 
  | 'usdt@eth' 
  | 'usdc@eth'
  | 'trx' 
  | 'usdt@trx' 
  | 'usdc@trx'
  | 'bnb' 
  | 'usdt@bnb' 
  | 'usdc@bnb'
  | 'ltc' 
  | 'bch' 
  | 'doge';

export interface ApironeAccount {
  account: string;
  created: string;
  transferKey: string;
}

export interface ApironeAddress {
  account: string;
  currency: ApiironeCurrency;
  address: string;
  created: string;
  type: string;
  callback?: {
    url: string;
    data?: Record<string, any>;
  };
}

export interface ApironePaymentStatus {
  txid?: string;
  amount: number;
  confirmations: number;
  currency: ApiironeCurrency;
  address: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface CreatePaymentOptions {
  account: string;
  currency: ApiironeCurrency;
  amount?: number; // in minor units (e.g., satoshi for BTC)
  callbackUrl: string;
  callbackData?: Record<string, any>;
}

/**
 * Creates Apirone account (one-time setup)
 */
export async function createApironeAccount(profile?: {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
}): Promise<ApironeAccount> {
  const response = await fetch(`${APIRONE_BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: {
        first_name: profile?.firstName,
        last_name: profile?.lastName,
        email: profile?.email,
        country: profile?.country,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Apirone account: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return {
    account: data.account,
    created: data.created,
    transferKey: data['transfer-key'],
  };
}

/**
 * Generates payment address for specific currency
 */
export async function generatePaymentAddress(
  options: CreatePaymentOptions
): Promise<ApironeAddress> {
  const { account, currency, callbackUrl, callbackData } = options;

  // Mock mode for development (CORS bypass)
  if (USE_MOCK) {
    console.log('🎭 MOCK: Generating address for', currency);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    
    const mockAddresses: Record<ApiironeCurrency, string> = {
      'btc': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      'eth': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      'usdt@eth': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      'usdc@eth': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      'trx': 'TZ23wChjN72mdxet916V8hoicPWH46hmT8',
      'usdt@trx': 'TZ23wChjN72mdxet916V8hoicPWH46hmT8',
      'usdc@trx': 'TZ23wChjN72mdxet916V8hoicPWH46hmT8',
      'bnb': 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      'usdt@bnb': 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      'usdc@bnb': 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      'ltc': 'LTC1234567890abcdefghijklmnopqrs',
      'bch': 'bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk',
      'doge': 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    };

    return {
      account,
      currency,
      address: mockAddresses[currency] || 'mock_address_' + Math.random().toString(36).substr(2, 9),
      created: new Date().toISOString(),
      type: 'generic',
      callback: {
        url: callbackUrl,
        data: callbackData
      }
    };
  }

  // Real API call
  const response = await fetch(`${APIRONE_BASE_URL}/accounts/${account}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currency,
      callback: {
        url: callbackUrl,
        data: callbackData || {}
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate address: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Checks balance of payment address
 */
export async function checkAddressBalance(
  account: string,
  address: string,
  currency: ApiironeCurrency
): Promise<{ available: number; total: number }> {
  // Mock mode - always return 0 (no payment received in mock)
  if (USE_MOCK) {
    console.log('🎭 MOCK: Checking balance for', address);
    return { available: 0, total: 0 };
  }

  // Real API call
  const params = new URLSearchParams({ currency });
  const response = await fetch(
    `${APIRONE_BASE_URL}/accounts/${account}/addresses/${address}/balance?${params}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to check balance: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return {
    available: data.available,
    total: data.total
  };
}

/**
 * Gets address info including transactions
 */
export async function getAddressInfo(
  account: string,
  address: string,
  currency?: ApiironeCurrency
): Promise<any> {
  const params = currency ? `?currency=${currency}` : '';
  const response = await fetch(
    `${APIRONE_BASE_URL}/accounts/${account}/addresses/${address}${params}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get address info: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Gets current exchange rate
 */
export async function getExchangeRate(currency: ApiironeCurrency): Promise<number> {
  // Mock mode
  if (USE_MOCK) {
    const mockRates: Record<ApiironeCurrency, number> = {
      'btc': 45000,
      'eth': 2500,
      'usdt@eth': 1.0,
      'usdc@eth': 1.0,
      'trx': 0.10,
      'usdt@trx': 1.0,
      'usdc@trx': 1.0,
      'bnb': 300,
      'usdt@bnb': 1.0,
      'usdc@bnb': 1.0,
      'ltc': 75,
      'bch': 250,
      'doge': 0.08,
    };
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRates[currency] || 1.0;
  }

  // Real API call
  const response = await fetch(`${APIRONE_BASE_URL}/ticker?currency=${currency}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get exchange rate: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return parseFloat(data.usd);
}

/**
 * Converts USD amount to cryptocurrency minor units
 */
export async function convertUsdToCrypto(
  usdAmount: number,
  currency: ApiironeCurrency
): Promise<number> {
  const rate = await getExchangeRate(currency);
  const cryptoAmount = usdAmount / rate;
  
  // Convert to minor units based on currency
  const decimals = getCurrencyDecimals(currency);
  return Math.ceil(cryptoAmount * Math.pow(10, decimals));
}

/**
 * Gets decimal places for currency
 */
function getCurrencyDecimals(currency: ApiironeCurrency): number {
  const decimalsMap: Record<ApiironeCurrency, number> = {
    'btc': 8,
    'eth': 18,
    'usdt@eth': 6,
    'usdc@eth': 6,
    'trx': 6,
    'usdt@trx': 6,
    'usdc@trx': 6,
    'bnb': 18,
    'usdt@bnb': 6,
    'usdc@bnb': 6,
    'ltc': 8,
    'bch': 8,
    'doge': 8,
  };
  return decimalsMap[currency] || 8;
}

/**
 * Formats crypto amount for display
 */
export function formatCryptoAmount(amount: number, currency: ApiironeCurrency): string {
  const decimals = getCurrencyDecimals(currency);
  const displayAmount = amount / Math.pow(10, decimals);
  return displayAmount.toFixed(Math.min(decimals, 8));
}

/**
 * Gets currency display name
 */
export function getCurrencyName(currency: ApiironeCurrency): string {
  const names: Record<ApiironeCurrency, string> = {
    'btc': 'Bitcoin',
    'eth': 'Ethereum',
    'usdt@eth': 'USDT (ERC-20)',
    'usdc@eth': 'USDC (ERC-20)',
    'trx': 'Tron',
    'usdt@trx': 'USDT (TRC-20)',
    'usdc@trx': 'USDC (TRC-20)',
    'bnb': 'Binance Coin',
    'usdt@bnb': 'USDT (BEP-20)',
    'usdc@bnb': 'USDC (BEP-20)',
    'ltc': 'Litecoin',
    'bch': 'Bitcoin Cash',
    'doge': 'Dogecoin',
  };
  return names[currency] || currency.toUpperCase();
}

/**
 * Gets currency symbol
 */
export function getCurrencySymbol(currency: ApiironeCurrency): string {
  if (currency.includes('@')) {
    return currency.split('@')[0].toUpperCase();
  }
  return currency.toUpperCase();
}
