import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockEntities } from '@/lib/store';

// GET /api/entities - List all entities
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockEntities);
  }
  
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 });
  }
}

// POST /api/entities - Create new entity
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('entities')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 });
  }
}
