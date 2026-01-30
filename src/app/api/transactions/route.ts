import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockTransactions } from '@/lib/store';

// GET /api/transactions
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockTransactions);
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entity_id');
    const propertyId = searchParams.get('property_id');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');
    const supabase = getSupabase();
    
    let query = supabase
      .from('transactions')
      .select(`*, entity:entities(id, name), property:properties(id, address), vendor:vendors(id, name)`)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (entityId) query = query.eq('entity_id', entityId);
    if (propertyId) query = query.eq('property_id', propertyId);
    if (type) query = query.eq('type', type);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

// PATCH /api/transactions
export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const supabase = getSupabase();
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
