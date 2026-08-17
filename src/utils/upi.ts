/**
 * NPCI UPI Intent & URI Generator Utility
 */

export interface UPIURIParams {
  vpa: string;
  name: string;
  amount?: number | null;
  currency?: string;
}

/**
 * Builds standard NPCI upi://pay URI string
 */
export function buildUPIPayURI({
  vpa,
  name,
  amount,
  currency = 'INR',
}: UPIURIParams): string {
  const cleanVPA = vpa.trim().toLowerCase();
  const encodedName = encodeURIComponent(name.trim());

  let uri = `upi://pay?pa=${cleanVPA}&pn=${encodedName}&cu=${currency}`;

  if (amount && amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }

  return uri;
}

/**
 * Obfuscates Virtual Payment Address (VPA) for privacy
 * Example: "ramesh.tea@oksbi" -> "ram***@oksbi"
 */
export function maskVPA(vpa: string): string {
  if (!vpa || !vpa.includes('@')) return vpa || '—';
  const [username, handle] = vpa.split('@');
  if (username.length <= 3) {
    return `${username.charAt(0)}***@${handle}`;
  }
  return `${username.slice(0, 3)}***@${handle}`;
}

/**
 * Validates basic VPA structure
 */
export function isValidVPA(vpa: string): boolean {
  if (!vpa) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;
  return regex.test(vpa.trim());
}
