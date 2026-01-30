import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  // If Supabase isn't configured, return mock data
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({
      total_properties: 5,
      total_entities: 4,
      total_revenue_mtd: 6400,
      total_expenses_mtd: 1274.54,
      net_income_mtd: 5125.46,
      pending_w9_count: 1,
      unmatched_transactions: 1,
      lowes_pending_allocation: 1,
      _mock: true
    });
  }
  
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Get counts
    const [
      { count: propertiesCount },
      { count: entitiesCount },
      { data: mtdTransactions },
      { data: vendorsNeedingW9 },
      { count: unmatchedCount },
      { count: lowesPending }
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('entities').select('*', { count: 'exact', head: true }),
      supabase.from('transactions')
        .select('type, amount')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth),
      supabase.from('vendor_ytd_summary')
        .select('*')
        .eq('w9_status', 'needs_w9'),
      supabase.from('transactions')
        .select('*', { count: 'exact', head: true })
        .is('property_id', null),
      supabase.from('lowes_statements')
        .select('*', { count: 'exact', head: true })
        .eq('processed', false)
    ]);
    
    // Calculate MTD totals
    const revenueMTD = mtdTransactions
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    const expensesMTD = mtdTransactions
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    return NextResponse.json({
      total_properties: propertiesCount || 0,
      total_entities: entitiesCount || 0,
      total_revenue_mtd: revenueMTD,
      total_expenses_mtd: expensesMTD,
      net_income_mtd: revenueMTD - expensesMTD,
      pending_w9_count: vendorsNeedingW9?.length || 0,
      unmatched_transactions: unmatchedCount || 0,
      lowes_pending_allocation: lowesPending || 0
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
