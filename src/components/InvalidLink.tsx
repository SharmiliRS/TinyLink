export function InvalidLink() {
  return (
    <div className="min-h-screen bg-[#FDE8E8] flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-[#450606] mb-4">
          Link Expired
        </h1>
        <p className="text-[#450606] mb-2">
          This short URL is no longer active.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          The link may have been deleted by the owner or has expired.
        </p>
        <div className="space-y-3">
          <a 
            href="/" 
            className="block bg-[#450606] text-white px-6 py-3 rounded-lg hover:bg-[#340505] transition-colors font-semibold"
          >
            🏠 Go to Homepage
          </a>
          <a 
            href="/" 
            className="block border border-[#450606] text-[#450606] px-6 py-3 rounded-lg hover:bg-[#450606] hover:text-white transition-colors font-semibold"
          >
            ✨ Create New Link
          </a>
        </div>
      </div>
    </div>
  )
}