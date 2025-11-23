// Updated API route for better hosting compatibility
import { NextResponse } from 'next/server'
import { prisma } from '@/../lib/db'

export async function GET() {
  try {
    const totalLinks = await prisma.link.count()
    
    const totalClicksResult = await prisma.link.aggregate({
      _sum: { clicks: true }
    })
    const totalClicks = totalClicksResult._sum.clicks || 0

    // More reliable memory calculation for hosting
    const memoryUsage = getReliableMemoryUsage()

    const systemInfo = {
      uptime: formatUptime(process.uptime()),
      timestamp: new Date().toISOString(),
      memoryUsage,
      totalLinks,
      totalClicks,
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      uptime: '0m',
      timestamp: new Date().toISOString(),
      memoryUsage: 0,
      totalLinks: 0,
      totalClicks: 0,
      environment: 'error'
    }, { status: 500 })
  }
}

function getReliableMemoryUsage(): number {
  try {
    const usage = process.memoryUsage()
    // More conservative calculation for hosting
    const usagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100)
    return Math.min(usagePercent, 100) // Cap at 100%
  } catch {
    return 0 // Fallback if memory reading fails
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}