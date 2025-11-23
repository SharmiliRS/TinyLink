'use client'

import { useState, useEffect } from 'react'
import { Server, Clock, Cpu, Link2 } from 'lucide-react'

interface SystemInfo {
  uptime: string
  timestamp: string
  memoryUsage: number
  totalLinks: number
  totalClicks: number
}

export default function HealthcheckPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemInfo()
    const interval = setInterval(fetchSystemInfo, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/healthz')
      if (response.ok) {
        const data = await response.json()
        setSystemInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch system info')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className=" bg-[#fffcfc]">
        <div className="px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[#450606]/10 rounded-xl w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-3 border border-[#450606]/10">
                  <div className="h-4 bg-[#450606]/10 rounded-lg w-20"></div>
                  <div className="h-6 bg-[#450606]/10 rounded-lg w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-[#fffcfc]">
      <div className="px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#450606] mb-2">System Health</h1>
          <p className="text-[#450606]/60">System details and uptime information</p>
        </div>

        {systemInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Uptime */}
            <div className="bg-[#FDE8E8] rounded-xl p-6 border border-[#450606]/10">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-[#450606]">Uptime</h3>
                  <p className="text-[#450606]/60 text-sm">System running time</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#450606]">{systemInfo.uptime}</p>
            </div>

            {/* Memory Usage */}
            <div className="bg-[#FDE8E8] rounded-xl p-6 border border-[#450606]/10">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-bold text-[#450606]">Memory Usage</h3>
                  <p className="text-[#450606]/60 text-sm">Current memory consumption</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#450606]">{systemInfo.memoryUsage}%</p>
            </div>

            {/* Total Links */}
            <div className="bg-[#FDE8E8] rounded-xl p-6 border border-[#450606]/10">
              <div className="flex items-center space-x-3 mb-4">
                <Link2 className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-bold text-[#450606]">Total Links</h3>
                  <p className="text-[#450606]/60 text-sm">Shortened URLs created</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#450606]">{systemInfo.totalLinks}</p>
            </div>

            {/* Total Clicks */}
            <div className="bg-[#FDE8E8] rounded-xl p-6 border border-[#450606]/10">
              <div className="flex items-center space-x-3 mb-4">
                <Cpu className="w-8 h-8 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-[#450606]">Total Clicks</h3>
                  <p className="text-[#450606]/60 text-sm">All-time link clicks</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#450606]">{systemInfo.totalClicks}</p>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-[#450606]/50 text-sm">
            Last updated: {systemInfo ? new Date(systemInfo.timestamp).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  )
}