import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUrl, shortCode } = body;

    // Validate required fields
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'targetUrl is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let finalShortCode = shortCode;

    // Generate short code if not provided
    if (!finalShortCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        finalShortCode = '';
        for (let i = 0; i < 6; i++) {
          finalShortCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const existing = await prisma.link.findUnique({
          where: { shortCode: finalShortCode },
        });
        
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }
      
      if (!isUnique) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    } else {
      // Validate custom short code
      if (!/^[A-Za-z0-9]{6,8}$/.test(finalShortCode)) {
        return NextResponse.json(
          { error: 'Short code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      // Check if custom code already exists
      const existingLink = await prisma.link.findUnique({
        where: { shortCode: finalShortCode },
      });

      if (existingLink) {
        return NextResponse.json(
          { error: 'Short code already exists' },
          { status: 409 }
        );
      }
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        shortCode: finalShortCode,
        targetUrl,
      },
    });

    return NextResponse.json({ 
      success: true,
      link: {
        id: link.id,
        shortCode: link.shortCode,
        targetUrl: link.targetUrl,
        clicks: link.clicks,
        lastClicked: link.lastClicked,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}