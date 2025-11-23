import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/../lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const updatedLink = await prisma.link.update({
      where: { shortCode: code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Error incrementing click:', error)
    return NextResponse.json({ error: 'Failed to update click count' }, { status: 500 })
  }
}