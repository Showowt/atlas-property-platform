// ATLAS - Autonomous Transaction Ledger & Asset System
// Core Type Definitions

export type EntityType = 'llc' | 'individual' | 'company';
export type PropertyType = 'sfr' | 'multi_family' | 'commercial' | 'mixed_use' | 'personal';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'cleared' | 'reconciled';

// Entity (LLC, Company, Individual)
export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  tax_id?: string;
  parent_entity_id?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// Property
export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  owner_entity_id: string;
  property_type: PropertyType;
  buildium_property_id?: string;
  lowes_job_name?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  purchase_date?: string;
  purchase_price?: number;
  monthly_rent?: number;
  created_at: string;
  updated_at: string;
}

// Vendor
export interface Vendor {
  id: string;
  name: string;
  tax_id?: string;
  w9_on_file: boolean;
  w9_document_url?: string;
  w9_received_date?: string;
  w9_requested_date?: string;
  is_corporation: boolean;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Transaction
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  entity_id: string;
  property_id?: string;
  vendor_id?: string;
  category: string;
  subcategory?: string;
  bank_account_id?: string;
  plaid_transaction_id?: string;
  receipt_url?: string;
  notes?: string;
  auto_categorized: boolean;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

// Bank Account
export interface BankAccount {
  id: string;
  name: string;
  institution: string;
  account_type: 'checking' | 'savings' | 'credit_card' | 'line_of_credit';
  mask: string; // Last 4 digits
  entity_id: string;
  plaid_account_id?: string;
  current_balance?: number;
  available_balance?: number;
  created_at: string;
  updated_at: string;
}

// Vendor Payment Tracking (for W-9/1099)
export interface VendorPayment {
  id: string;
  vendor_id: string;
  entity_id: string;
  property_id?: string;
  amount: number;
  payment_date: string;
  tax_year: number;
  transaction_id?: string;
  created_at: string;
}

// Lowe's Statement Line Item
export interface LowesLineItem {
  id: string;
  statement_id: string;
  job_name: string;
  item_description: string;
  amount: number;
  quantity: number;
  unit_price: number;
  purchase_date: string;
  property_id?: string;
  entity_id?: string;
  matched: boolean;
  created_at: string;
}

// Lowe's Statement
export interface LowesStatement {
  id: string;
  statement_date: string;
  statement_period_start: string;
  statement_period_end: string;
  total_amount: number;
  document_url?: string;
  processed: boolean;
  processing_status: 'pending' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

// Housing Authority Rent Change
export interface RentChange {
  id: string;
  property_id: string;
  tenant_name: string;
  old_hap_amount: number;
  new_hap_amount: number;
  old_tenant_portion: number;
  new_tenant_portion: number;
  effective_date: string;
  document_url?: string;
  applied_to_buildium: boolean;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_properties: number;
  total_entities: number;
  total_revenue_mtd: number;
  total_expenses_mtd: number;
  net_income_mtd: number;
  pending_w9_count: number;
  unmatched_transactions: number;
  lowes_pending_allocation: number;
}

// Allocation Report (for Lowe's by LLC)
export interface AllocationReport {
  entity_id: string;
  entity_name: string;
  total_amount: number;
  line_items: {
    property_address: string;
    amount: number;
    item_count: number;
  }[];
}

// Category for transactions
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  parent_id?: string;
  schedule_e_line?: string;
  is_deductible: boolean;
}

// Default categories for property accounting
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  // Income
  { name: 'Rental Income (LTR)', type: 'income', schedule_e_line: '3', is_deductible: false },
  { name: 'Rental Income (STR)', type: 'income', schedule_e_line: '3', is_deductible: false },
  { name: 'Cleaning Fees', type: 'income', schedule_e_line: '3', is_deductible: false },
  { name: 'Pet Fees', type: 'income', schedule_e_line: '3', is_deductible: false },
  { name: 'Late Fees', type: 'income', schedule_e_line: '3', is_deductible: false },
  
  // Expenses
  { name: 'Mortgage Interest', type: 'expense', schedule_e_line: '12', is_deductible: true },
  { name: 'Property Taxes', type: 'expense', schedule_e_line: '16', is_deductible: true },
  { name: 'Insurance', type: 'expense', schedule_e_line: '9', is_deductible: true },
  { name: 'Utilities', type: 'expense', schedule_e_line: '17', is_deductible: true },
  { name: 'Repairs & Maintenance', type: 'expense', schedule_e_line: '14', is_deductible: true },
  { name: 'Cleaning & Turnover', type: 'expense', schedule_e_line: '14', is_deductible: true },
  { name: 'Supplies', type: 'expense', schedule_e_line: '15', is_deductible: true },
  { name: 'Landscaping', type: 'expense', schedule_e_line: '14', is_deductible: true },
  { name: 'HOA Fees', type: 'expense', schedule_e_line: '17', is_deductible: true },
  { name: 'Platform Fees', type: 'expense', schedule_e_line: '10', is_deductible: true },
  { name: 'Management Fees', type: 'expense', schedule_e_line: '11', is_deductible: true },
  { name: 'Professional Services', type: 'expense', schedule_e_line: '17', is_deductible: true },
  { name: 'Travel', type: 'expense', schedule_e_line: '18', is_deductible: true },
  { name: 'Home Improvement', type: 'expense', schedule_e_line: '14', is_deductible: true },
];
