import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProperties } from '@/lib/store';

// POST /api/lowes/parse - Parse Lowe's statement with Claude Vision
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // For PDFs, we'd need to convert to images first
    if (file.type === 'application/pdf') {
      return NextResponse.json({ 
        error: 'PDF upload not yet supported. Please upload an image (photo or screenshot) of the statement.',
        hint: 'Take a photo or screenshot of each page of your Lowe\'s statement'
      }, { status: 400 });
    }
    
    // Determine media type (only images supported)
    const mediaType = file.type.startsWith('image/') 
      ? file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      : 'image/png';
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    
    // Get list of properties for matching
    let propertyList = mockProperties.map(p => ({
      id: p.id,
      address: p.address,
      jobName: p.lowes_job_name,
      entityId: p.owner_entity_id
    }));
    
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const { data: properties } = await supabase
        .from('properties')
        .select('id, address, lowes_job_name, owner_entity_id');
      
      if (properties) {
        propertyList = properties.map(p => ({
          id: p.id,
          address: p.address,
          jobName: p.lowes_job_name,
          entityId: p.owner_entity_id
        }));
      }
    }
    
    // Check for Anthropic API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'OCR not configured',
        hint: 'Set ANTHROPIC_API_KEY environment variable'
      }, { status: 503 });
    }
    
    // Dynamic import to avoid build issues if not configured
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    // Call Claude to parse the statement
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Parse this Lowe's commercial account statement. Extract all line items.

For each line item extract: job_name, item_description, quantity, unit_price, amount, purchase_date (if visible).

Known properties to match: ${JSON.stringify(propertyList)}

Respond ONLY with JSON:
{
  "statement": { "statement_date": "YYYY-MM-DD", "statement_period_start": "YYYY-MM-DD", "statement_period_end": "YYYY-MM-DD", "total_amount": 0.00 },
  "lineItems": [{ "job_name": "", "item_description": "", "quantity": 1, "unit_price": 0.00, "amount": 0.00, "purchase_date": null, "property_id": null, "matched": false }]
}`
            }
          ],
        }
      ],
    });
    
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    
    let parsed;
    try {
      parsed = JSON.parse(content.text);
    } catch {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse response as JSON');
      }
    }
    
    return NextResponse.json({
      success: true,
      data: parsed,
      message: `Parsed ${parsed.lineItems?.length || 0} line items`
    });
    
  } catch (error) {
    console.error('Error parsing Lowes statement:', error);
    return NextResponse.json({ 
      error: 'Failed to parse statement',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
