import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/lowes
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const statementId = searchParams.get('statement_id');
    const supabase = getSupabase();
    
    if (statementId) {
      const { data: statement, error: stmtError } = await supabase
        .from('lowes_statements')
        .select('*')
        .eq('id', statementId)
        .single();
      
      if (stmtError) throw stmtError;
      
      const { data: lineItems, error: itemsError } = await supabase
        .from('lowes_line_items')
        .select(`*, property:properties(id, address, owner_entity_id), entity:entities(id, name)`)
        .eq('statement_id', statementId)
        .order('job_name');
      
      if (itemsError) throw itemsError;
      
      return NextResponse.json({ statement, lineItems });
    }
    
    const { data, error } = await supabase
      .from('lowes_statements')
      .select('*')
      .order('statement_date', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Lowes data:', error);
    return NextResponse.json({ error: 'Failed to fetch Lowes data' }, { status: 500 });
  }
}

// POST /api/lowes
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { statement, lineItems } = body;
    const supabase = getSupabase();
    
    const { data: stmtData, error: stmtError } = await supabase
      .from('lowes_statements')
      .insert(statement)
      .select()
      .single();
    
    if (stmtError) throw stmtError;
    
    if (lineItems && lineItems.length > 0) {
      const itemsWithStmtId = lineItems.map((item: any) => ({
        ...item,
        statement_id: stmtData.id
      }));
      
      const { error: itemsError } = await supabase
        .from('lowes_line_items')
        .insert(itemsWithStmtId);
      
      if (itemsError) throw itemsError;
    }
    
    return NextResponse.json(stmtData, { status: 201 });
  } catch (error) {
    console.error('Error creating Lowes statement:', error);
    return NextResponse.json({ error: 'Failed to create statement' }, { status: 500 });
  }
}

// PATCH /api/lowes
export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { lineItemId, propertyId, entityId } = body;
    const supabase = getSupabase();
    
    if (!lineItemId) {
      return NextResponse.json({ error: 'Line item ID required' }, { status: 400 });
    }
    
    const updates: any = { matched: true };
    if (propertyId) updates.property_id = propertyId;
    if (entityId) updates.entity_id = entityId;
    
    const { data, error } = await supabase
      .from('lowes_line_items')
      .update(updates)
      .eq('id', lineItemId)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating line item:', error);
    return NextResponse.json({ error: 'Failed to update line item' }, { status: 500 });
  }
}
