import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  }).format(new Date(date));
}

export function parseAddress(fullAddress: string): {
  street: string;
  city: string;
  state: string;
  zip: string;
} | null {
  // Common address parsing regex
  const match = fullAddress.match(/^(.+?),\s*(.+?),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)$/i);
  if (match) {
    return {
      street: match[1].trim(),
      city: match[2].trim(),
      state: match[3].toUpperCase(),
      zip: match[4],
    };
  }
  return null;
}

export function matchAddressToProperty(
  transactionDescription: string,
  properties: { id: string; address: string; lowes_job_name?: string }[]
): string | null {
  const descLower = transactionDescription.toLowerCase();
  
  for (const property of properties) {
    // Check Lowe's job name first (exact match priority)
    if (property.lowes_job_name && 
        descLower.includes(property.lowes_job_name.toLowerCase())) {
      return property.id;
    }
    
    // Check address components
    const addressParts = property.address.toLowerCase().split(/[\s,]+/);
    const matchCount = addressParts.filter(part => 
      part.length > 2 && descLower.includes(part)
    ).length;
    
    // If more than half the address parts match, it's likely a match
    if (matchCount >= addressParts.length / 2) {
      return property.id;
    }
  }
  
  return null;
}

export function calculateW9Status(
  totalPaid: number,
  w9OnFile: boolean,
  isCorporation: boolean
): 'not_required' | 'under_threshold' | 'needs_w9' | 'complete' {
  if (isCorporation) return 'not_required';
  if (totalPaid < 600) return 'under_threshold';
  if (w9OnFile) return 'complete';
  return 'needs_w9';
}

export function generateW9Email(vendorName: string, vendorEmail: string): {
  to: string;
  subject: string;
  body: string;
} {
  return {
    to: vendorEmail,
    subject: `W-9 Request - ${new Date().getFullYear()} Tax Documentation`,
    body: `Dear ${vendorName},

Our records indicate that we have paid you $600 or more this year, which requires us to file a 1099 form with the IRS.

To comply with tax regulations, we need you to complete and return a W-9 form at your earliest convenience.

You can download the W-9 form here: https://www.irs.gov/pub/irs-pdf/fw9.pdf

Please complete the form and return it to us within 14 days.

Thank you for your prompt attention to this matter.

Best regards,
Property Management Team`
  };
}

export function getCurrentTaxYear(): number {
  const now = new Date();
  // If we're in January, we might still be dealing with last year's taxes
  return now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
}

export function groupByEntity<T extends { entity_id: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.entity_id]) {
      acc[item.entity_id] = [];
    }
    acc[item.entity_id].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function groupByProperty<T extends { property_id?: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = item.property_id || 'unassigned';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
