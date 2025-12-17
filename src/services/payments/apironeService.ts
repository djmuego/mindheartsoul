
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
    throw new Error(`Failed to create Apirone account: ${response.statusText}`);
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
    throw new Error(`Failed to generate address: ${response.statusText}`);
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
  const params = new URLSearchParams({ currency });
  const response = await fetch(
    `${APIRONE_BASE_URL}/accounts/${account}/addresses/${address}/balance?${params}`
  );

  if (!response.ok) {
    throw new Error(`Failed to check balance: ${response.statusText}`);
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
    throw new Error(`Failed to get address info: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Gets current exchange rate
 */
export async function getExchangeRate(currency: ApiironeCurrency): Promise<number> {
  const response = await fetch(`https://apirone.com/api/v2/ticker?currency=${currency}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get exchange rate: ${response.statusText}`);
  }

  const data = await response.json();
  return parseFloat(data.usd); // Rate in USD
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
