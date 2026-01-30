// ATLAS - Mock Data Store
// This will be replaced with Supabase in production

import { 
  Entity, Property, Vendor, Transaction, BankAccount, 
  VendorPayment, LowesStatement, LowesLineItem, DashboardStats 
} from './types';

// Mock Entities (LLCs)
export const mockEntities: Entity[] = [
  {
    id: 'ent_001',
    name: 'Wabash Partners',
    type: 'llc',
    tax_id: '12-3456789',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent_002',
    name: '0608 LLC',
    type: 'llc',
    tax_id: '98-7654321',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent_003',
    name: 'Shantalie',
    type: 'company',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent_004',
    name: 'Personal',
    type: 'individual',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'prop_001',
    address: '1234 Oak Street',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    owner_entity_id: 'ent_001', // Wabash Partners
    property_type: 'sfr',
    lowes_job_name: '1234 Oak Street',
    beds: 3,
    baths: 2,
    monthly_rent: 1200,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prop_002',
    address: '5678 Maple Ave',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46202',
    owner_entity_id: 'ent_001', // Wabash Partners
    property_type: 'sfr',
    lowes_job_name: '5678 Maple Ave',
    beds: 4,
    baths: 2,
    monthly_rent: 1450,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prop_003',
    address: '910 Pine Road',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46203',
    owner_entity_id: 'ent_002', // 0608 LLC
    property_type: 'sfr',
    lowes_job_name: '910 Pine Road',
    beds: 2,
    baths: 1,
    monthly_rent: 950,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prop_004',
    address: '2468 Elm Court',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46204',
    owner_entity_id: 'ent_002', // 0608 LLC
    property_type: 'multi_family',
    lowes_job_name: '2468 Elm Court',
    beds: 6,
    baths: 4,
    monthly_rent: 2800,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prop_005',
    address: '1357 Personal Home Dr',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46205',
    owner_entity_id: 'ent_004', // Personal
    property_type: 'personal',
    lowes_job_name: '1357 Personal Home',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'vnd_001',
    name: "Joe's Plumbing",
    tax_id: '11-1111111',
    w9_on_file: true,
    w9_received_date: '2024-02-15',
    is_corporation: false,
    email: 'joe@joesplumbing.com',
    phone: '317-555-0101',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vnd_002',
    name: 'ABC Electric',
    is_corporation: false,
    w9_on_file: false,
    email: 'service@abcelectric.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vnd_003',
    name: "Maria's Cleaning Services",
    is_corporation: false,
    w9_on_file: false,
    email: 'maria@mariascleaning.com',
    phone: '317-555-0103',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vnd_004',
    name: 'Home Depot',
    is_corporation: true,
    w9_on_file: false, // Corps don't need W9
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vnd_005',
    name: "Lowe's",
    is_corporation: true,
    w9_on_file: false, // Corps don't need W9
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Vendor Payments (YTD)
export const mockVendorPayments: VendorPayment[] = [
  { id: 'vp_001', vendor_id: 'vnd_001', entity_id: 'ent_001', property_id: 'prop_001', amount: 850, payment_date: '2024-01-15', tax_year: 2024, created_at: '2024-01-15T00:00:00Z' },
  { id: 'vp_002', vendor_id: 'vnd_001', entity_id: 'ent_002', property_id: 'prop_003', amount: 1200, payment_date: '2024-02-20', tax_year: 2024, created_at: '2024-02-20T00:00:00Z' },
  { id: 'vp_003', vendor_id: 'vnd_001', entity_id: 'ent_001', property_id: 'prop_002', amount: 450, payment_date: '2024-03-10', tax_year: 2024, created_at: '2024-03-10T00:00:00Z' },
  { id: 'vp_004', vendor_id: 'vnd_002', entity_id: 'ent_002', property_id: 'prop_004', amount: 320, payment_date: '2024-02-01', tax_year: 2024, created_at: '2024-02-01T00:00:00Z' },
  { id: 'vp_005', vendor_id: 'vnd_002', entity_id: 'ent_001', property_id: 'prop_001', amount: 275, payment_date: '2024-03-15', tax_year: 2024, created_at: '2024-03-15T00:00:00Z' },
  { id: 'vp_006', vendor_id: 'vnd_003', entity_id: 'ent_001', property_id: 'prop_001', amount: 150, payment_date: '2024-01-05', tax_year: 2024, created_at: '2024-01-05T00:00:00Z' },
  { id: 'vp_007', vendor_id: 'vnd_003', entity_id: 'ent_001', property_id: 'prop_002', amount: 150, payment_date: '2024-02-05', tax_year: 2024, created_at: '2024-02-05T00:00:00Z' },
  { id: 'vp_008', vendor_id: 'vnd_003', entity_id: 'ent_002', property_id: 'prop_003', amount: 150, payment_date: '2024-03-05', tax_year: 2024, created_at: '2024-03-05T00:00:00Z' },
  { id: 'vp_009', vendor_id: 'vnd_003', entity_id: 'ent_002', property_id: 'prop_004', amount: 300, payment_date: '2024-01-10', tax_year: 2024, created_at: '2024-01-10T00:00:00Z' },
  { id: 'vp_010', vendor_id: 'vnd_003', entity_id: 'ent_001', property_id: 'prop_001', amount: 150, payment_date: '2024-03-05', tax_year: 2024, created_at: '2024-03-05T00:00:00Z' },
  { id: 'vp_011', vendor_id: 'vnd_003', entity_id: 'ent_001', property_id: 'prop_002', amount: 150, payment_date: '2024-03-20', tax_year: 2024, created_at: '2024-03-20T00:00:00Z' },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    date: '2024-01-15',
    description: 'Rent payment - 1234 Oak Street',
    amount: 1200,
    type: 'income',
    status: 'reconciled',
    entity_id: 'ent_001',
    property_id: 'prop_001',
    category: 'Rental Income (LTR)',
    auto_categorized: true,
    confidence_score: 0.95,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'txn_002',
    date: '2024-01-15',
    description: 'Rent payment - 5678 Maple Ave',
    amount: 1450,
    type: 'income',
    status: 'reconciled',
    entity_id: 'ent_001',
    property_id: 'prop_002',
    category: 'Rental Income (LTR)',
    auto_categorized: true,
    confidence_score: 0.95,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'txn_003',
    date: '2024-01-20',
    description: "Joe's Plumbing - Water heater repair",
    amount: 850,
    type: 'expense',
    status: 'reconciled',
    entity_id: 'ent_001',
    property_id: 'prop_001',
    vendor_id: 'vnd_001',
    category: 'Repairs & Maintenance',
    auto_categorized: true,
    confidence_score: 0.88,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'txn_004',
    date: '2024-01-25',
    description: "Lowe's - 1234 Oak Street",
    amount: 234.56,
    type: 'expense',
    status: 'cleared',
    entity_id: 'ent_001',
    property_id: 'prop_001',
    vendor_id: 'vnd_005',
    category: 'Supplies',
    auto_categorized: true,
    confidence_score: 0.92,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'txn_005',
    date: '2024-01-28',
    description: 'ZELLE PAYMENT FROM JOHN DOE',
    amount: 950,
    type: 'income',
    status: 'pending',
    entity_id: 'ent_002',
    property_id: 'prop_003',
    category: 'Rental Income (LTR)',
    auto_categorized: false,
    created_at: '2024-01-28T00:00:00Z',
    updated_at: '2024-01-28T00:00:00Z',
  },
  {
    id: 'txn_006',
    date: '2024-01-30',
    description: 'Amazon - Smoke detectors',
    amount: 89.99,
    type: 'expense',
    status: 'cleared',
    entity_id: 'ent_002',
    property_id: undefined, // Unmatched - needs attribution
    category: 'Supplies',
    auto_categorized: true,
    confidence_score: 0.75,
    created_at: '2024-01-30T00:00:00Z',
    updated_at: '2024-01-30T00:00:00Z',
  },
];

// Mock Bank Accounts
export const mockBankAccounts: BankAccount[] = [
  {
    id: 'ba_001',
    name: 'Wabash Partners Operating',
    institution: 'Chase',
    account_type: 'checking',
    mask: '4521',
    entity_id: 'ent_001',
    current_balance: 24500.00,
    available_balance: 24000.00,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ba_002',
    name: '0608 LLC Operating',
    institution: 'Chase',
    account_type: 'checking',
    mask: '7832',
    entity_id: 'ent_002',
    current_balance: 18750.00,
    available_balance: 18500.00,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ba_003',
    name: "Lowe's Credit Account",
    institution: "Lowe's",
    account_type: 'credit_card',
    mask: '9012',
    entity_id: 'ent_002', // Tied to 0608 LLC but used across all
    current_balance: -2463.06,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Calculate dashboard stats
export function calculateDashboardStats(): DashboardStats {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const mtdTransactions = mockTransactions.filter(t => {
    const txnDate = new Date(t.date);
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });
  
  const revenue = mtdTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = mtdTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate vendors needing W9
  const vendorTotals = mockVendorPayments.reduce((acc, vp) => {
    if (!acc[vp.vendor_id]) acc[vp.vendor_id] = 0;
    acc[vp.vendor_id] += vp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const vendorsNeedingW9 = mockVendors.filter(v => 
    !v.is_corporation && 
    !v.w9_on_file && 
    (vendorTotals[v.id] || 0) >= 600
  ).length;
  
  const unmatchedTransactions = mockTransactions.filter(t => !t.property_id).length;
  
  return {
    total_properties: mockProperties.length,
    total_entities: mockEntities.length,
    total_revenue_mtd: revenue,
    total_expenses_mtd: expenses,
    net_income_mtd: revenue - expenses,
    pending_w9_count: vendorsNeedingW9,
    unmatched_transactions: unmatchedTransactions,
    lowes_pending_allocation: 1, // Mock: 1 statement pending
  };
}

// Get vendor YTD totals
export function getVendorYTDTotals(): { vendor: Vendor; ytd_total: number; needs_w9: boolean }[] {
  const vendorTotals = mockVendorPayments.reduce((acc, vp) => {
    if (!acc[vp.vendor_id]) acc[vp.vendor_id] = 0;
    acc[vp.vendor_id] += vp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return mockVendors.map(vendor => ({
    vendor,
    ytd_total: vendorTotals[vendor.id] || 0,
    needs_w9: !vendor.is_corporation && !vendor.w9_on_file && (vendorTotals[vendor.id] || 0) >= 600,
  }));
}
