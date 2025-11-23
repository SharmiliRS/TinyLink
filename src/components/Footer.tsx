import { Link2, Heart, Github, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gradient-to-r from-[#450606] to-[#5a0a0a] border-t border-[#FDE8E8]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FDE8E8] to-[#f8d4d4] rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[#450606]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FDE8E8]">TinyLink</h3>
                <p className="text-[#FDE8E8]/70 text-sm">Premium URL Shortener</p>
              </div>
            </div>
            <p className="text-[#FDE8E8]/80 text-sm max-w-md">
              Create short, memorable links and track their performance with our powerful analytics platform. 
              Perfect for marketers, developers, and content creators.
            </p>
            
           
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FDE8E8]">Quick Links</h4>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-[#FDE8E8]/80 hover:text-[#FDE8E8] transition-colors duration-200 text-sm"
              >
                Home
              </Link>
              <Link 
                href="/analytics" 
                className="block text-[#FDE8E8]/80 hover:text-[#FDE8E8] transition-colors duration-200 text-sm"
              >
                Analytics
              </Link>
              <Link 
                href="/healthz" 
                className="block text-[#FDE8E8]/80 hover:text-[#FDE8E8] transition-colors duration-200 text-sm"
              >
                System Health
              </Link>
            </div>
          </div>

         
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FDE8E8]/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-[#FDE8E8]/70 text-sm">
            <span>© {currentYear} TinyLink. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
        
            <div className="flex items-center space-x-2 text-[#FDE8E8]/70">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>by TinyLink Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}