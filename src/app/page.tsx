'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { LinkForm } from '@/components/LinkForm'

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0)

  const handleLinkCreated = () => {
    setRefresh(prev => prev + 1)
  }

  return (
    <>
      

      <div className="min-h-screen bg-[#fffcfc]">
        <div className="max-w-7xl mx-auto">
          
          {/* Link Form Only - Full Width */}
          <LinkForm onLinkCreated={handleLinkCreated} />

        </div>
      </div>
    </>
  )
}