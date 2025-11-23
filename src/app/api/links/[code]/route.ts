import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error: any) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Check if link exists first
    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Delete the link
    await prisma.link.delete({
      where: { shortCode: code },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content for successful delete
  } catch (error: any) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link: ' + error.message },
      { status: 500 }
    );
  }
}