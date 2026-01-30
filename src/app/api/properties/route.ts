import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProperties } from '@/lib/store';

// GET /api/properties - List all properties with entity info
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockProperties);
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entity_id');
    const supabase = getSupabase();
    
    let query = supabase
      .from('properties')
      .select(`*, entity:entities(id, name, type)`)
      .order('address');
    
    if (entityId) {
      query = query.eq('owner_entity_id', entityId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const supabase = getSupabase();
    
    if (!body.lowes_job_name) {
      body.lowes_job_name = body.address;
    }
    
    const { data, error } = await supabase
      .from('properties')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
