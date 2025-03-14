// app/api/researchHistory/route.ts
import { NextResponse } from 'next/server';
import { 
    createResearchItem, 
    getAllResearchHistory, 
    getOneResearchItem, 
    deleteResearchItem 
  } from '@/lib/actions/research.actions';
  
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const result = await getOneResearchItem(id);
    return NextResponse.json(result);
  } else {
    const result = await getAllResearchHistory();
    return NextResponse.json(result);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await createResearchItem(body);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'No id provided' });
  }
  const response = await deleteResearchItem(id);
  return NextResponse.json(response);
}
