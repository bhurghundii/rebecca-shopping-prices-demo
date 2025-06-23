import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/items - list all items
export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST /api/items - create or update an item (admin only)
export async function POST(req: NextRequest) {
  // Check for user cookie
  const userCookie = req.cookies.get('user');
  if (!userCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { name, price } = await req.json();
    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    // Upsert item by name
    const item = await prisma.item.upsert({
      where: { name },
      update: { price },
      create: { name, price },
    });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating/updating item:', error);
    return NextResponse.json({ error: 'Failed to save item' }, { status: 500 });
  }
}
