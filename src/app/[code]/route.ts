import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Find the link in database
    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    })

    if (!link) {
      return NextResponse.redirect(new URL('/invalid-link', request.url))
    }

    // Increment click count
    await prisma.link.update({
      where: { shortCode: code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    })

    // Return HTML with meta refresh to keep short URL in address bar
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${link.targetUrl}">
          <title>Redirecting...</title>
          <script>
            window.location.href = "${link.targetUrl}";
          </script>
        </head>
        <body>
          <p>Redirecting to <a href="${link.targetUrl}">${link.targetUrl}</a></p>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/invalid-link', request.url))
  }
}