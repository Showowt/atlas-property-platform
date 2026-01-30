import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if we have the required values
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Helper to get supabase or throw
export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return supabase;
};

// Types for database
export type Database = {
  public: {
    Tables: {
      entities: {
        Row: {
          id: string;
          name: string;
          type: 'llc' | 'individual' | 'company';
          tax_id: string | null;
          parent_entity_id: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['entities']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['entities']['Insert']>;
      };
      properties: {
        Row: {
          id: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          owner_entity_id: string;
          property_type: 'sfr' | 'multi_family' | 'commercial' | 'mixed_use' | 'personal';
          buildium_property_id: string | null;
          lowes_job_name: string | null;
          beds: number | null;
          baths: number | null;
          sqft: number | null;
          purchase_date: string | null;
          purchase_price: number | null;
          monthly_rent: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          tax_id: string | null;
          w9_on_file: boolean;
          w9_document_url: string | null;
          w9_received_date: string | null;
          w9_requested_date: string | null;
          is_corporation: boolean;
          email: string | null;
          phone: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          description: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          status: 'pending' | 'cleared' | 'reconciled';
          entity_id: string;
          property_id: string | null;
          vendor_id: string | null;
          category_id: string | null;
          bank_account_id: string | null;
          plaid_transaction_id: string | null;
          receipt_url: string | null;
          notes: string | null;
          auto_categorized: boolean;
          confidence_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      vendor_payments: {
        Row: {
          id: string;
          vendor_id: string;
          entity_id: string;
          property_id: string | null;
          amount: number;
          payment_date: string;
          tax_year: number;
          transaction_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vendor_payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['vendor_payments']['Insert']>;
      };
      lowes_statements: {
        Row: {
          id: string;
          statement_date: string;
          statement_period_start: string;
          statement_period_end: string;
          total_amount: number;
          document_url: string | null;
          processed: boolean;
          processing_status: 'pending' | 'processing' | 'completed' | 'error';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lowes_statements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lowes_statements']['Insert']>;
      };
      lowes_line_items: {
        Row: {
          id: string;
          statement_id: string;
          job_name: string;
          item_description: string;
          amount: number;
          quantity: number;
          unit_price: number;
          purchase_date: string | null;
          property_id: string | null;
          entity_id: string | null;
          matched: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lowes_line_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lowes_line_items']['Insert']>;
      };
    };
    Views: {
      vendor_ytd_summary: {
        Row: {
          id: string;
          name: string;
          w9_on_file: boolean;
          is_corporation: boolean;
          email: string | null;
          w9_requested_date: string | null;
          ytd_total: number;
          w9_status: 'exempt' | 'complete' | 'needs_w9' | 'under_threshold';
        };
      };
      property_pnl: {
        Row: {
          id: string;
          address: string;
          owner_entity_id: string;
          entity_name: string;
          total_income: number;
          total_expenses: number;
          net_income: number;
        };
      };
    };
  };
};
