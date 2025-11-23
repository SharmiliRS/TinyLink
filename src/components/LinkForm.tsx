"use client";

import { useState, useEffect } from "react";
import {
  isValidUrl,
  isValidShortCode,
  generateShortCode,
} from "@/../lib/utils";
import { Link2, Sparkles, Copy, Check, Zap, Rocket, ExternalLink, AlertCircle } from "lucide-react";
import Image from "next/image";

interface LinkFormProps {
  onLinkCreated: () => void;
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [targetUrl, setTargetUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // New state for real-time validation
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    message: string;
    isTouched: boolean;
  }>({
    isValid: false,
    message: "",
    isTouched: false,
  });

  // Helper function to get dynamic short URL
  const getShortUrl = (shortCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${shortCode}`;
    }
    return `/${shortCode}`;
  };

  // Reset image loaded state on component mount
  useEffect(() => {
    setIsImageLoaded(false);
    setImageError(false);
  }, []);

  // Enhanced URL validation function with proper domain checking
  const validateUrlFormat = (url: string): { isValid: boolean; message: string } => {
    if (!url.trim()) {
      return { isValid: false, message: "" };
    }

    // Protocol check
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return { 
        isValid: false, 
        message: "URL must start with http:// or https://" 
      };
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Check if hostname is valid
      if (!hostname) {
        return { 
          isValid: false, 
          message: "Invalid URL format" 
        };
      }

      // Basic domain pattern validation
      const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      
      if (!domainPattern.test(hostname)) {
        return { 
          isValid: false, 
          message: "Invalid domain format" 
        };
      }

      // Extract TLD (last part after last dot)
      const parts = hostname.split('.');
      const tld = parts[parts.length - 1].toLowerCase();
      
      // List of valid TLDs (you can expand this list)
      const validTLDs = [
        // Common TLDs
        'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
        // Country TLDs
        'in', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'br', 'ru', 'it', 'es', 'nl', 'se', 'no', 'dk', 'fi',
        'be', 'at', 'ch', 'pl', 'cz', 'hu', 'ro', 'bg', 'gr', 'tr', 'sa', 'ae', 'il', 'eg', 'za', 'ng', 'ke', 'et',
        'mx', 'ar', 'cl', 'co', 'pe', 've', 'nz', 'sg', 'my', 'id', 'th', 'vn', 'ph', 'kr', 'tw', 'hk', 'mo',
        // New TLDs
        'io', 'ai', 'app', 'dev', 'tech', 'site', 'online', 'store', 'shop', 'blog', 'news', 'club', 'life', 'fun',
        'xyz', 'top', 'win', 'bid', 'loan', 'mom', 'party', 'review', 'trade', 'webcam', 'accountant', 'download',
        'link', 'click', 'live', 'stream', 'guru', 'expert', 'consulting', 'company', 'group', 'network', 'systems',
        'solutions', 'services', 'digital', 'global', 'world', 'center', 'zone', 'today', 'now', 'here', 'space',
        'website', 'press', 'media', 'wiki', 'info', 'biz', 'name', 'mobi', 'pro', 'tel', 'asia', 'cat', 'jobs',
        'post', 'travel', 'aero', 'coop', 'museum'
      ];

      // Check for multi-level TLDs (like co.uk, com.au, etc.)
      const multiLevelTLDs = [
        'co.uk', 'com.au', 'org.uk', 'net.au', 'gov.uk', 'ac.uk', 'sch.uk', 'org.au', 'edu.au', 'gov.au',
        'co.in', 'org.in', 'net.in', 'gen.in', 'firm.in', 'ind.in', 'nic.in', 'ac.in', 'edu.in', 'res.in',
        'co.jp', 'or.jp', 'ne.jp', 'go.jp', 'ac.jp', 'ed.jp', 'gr.jp', 'lg.jp', 'co.kr', 'or.kr', 'ne.kr',
        'go.kr', 'ac.kr', 'hs.kr', 'ms.kr', 'es.kr', 'sc.kr', 'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'edu.cn',
        'ac.cn', 'mil.cn', 'ah.cn', 'bj.cn', 'cq.cn', 'fj.cn', 'gd.cn', 'gs.cn', 'gz.cn', 'gx.cn', 'ha.cn',
        'hb.cn', 'he.cn', 'hi.cn', 'hk.cn', 'hl.cn', 'hn.cn', 'jl.cn', 'js.cn', 'jx.cn', 'ln.cn', 'mo.cn',
        'nm.cn', 'nx.cn', 'qh.cn', 'sc.cn', 'sd.cn', 'sh.cn', 'sn.cn', 'sx.cn', 'tj.cn', 'tw.cn', 'xj.cn',
        'xz.cn', 'yn.cn', 'zj.cn'
      ];

      // Check for multi-level TLD first
      const lastTwoParts = parts.slice(-2).join('.');
      const lastThreeParts = parts.slice(-3).join('.');

      if (multiLevelTLDs.includes(lastTwoParts) || multiLevelTLDs.includes(lastThreeParts)) {
        return { 
          isValid: true, 
          message: "Valid URL format" 
        };
      }

      // Check single TLD
      if (!validTLDs.includes(tld)) {
        return { 
          isValid: false, 
          message: "Invalid domain extension (.com, .org, .in, etc.)" 
        };
      }

      // Check for consecutive dots or invalid characters
      if (hostname.includes("..") || hostname.includes("--")) {
        return { 
          isValid: false, 
          message: "Invalid domain name" 
        };
      }

      // Check domain length constraints
      if (hostname.length > 253) {
        return { 
          isValid: false, 
          message: "Domain name too long" 
        };
      }

      // Check each label (part between dots)
      for (const part of parts) {
        if (part.length > 63) {
          return { 
            isValid: false, 
            message: "Domain part too long" 
          };
        }
        if (part.startsWith('-') || part.endsWith('-')) {
          return { 
            isValid: false, 
            message: "Domain cannot start or end with hyphen" 
          };
        }
      }

      return { 
        isValid: true, 
        message: "Valid URL format" 
      };

    } catch (error) {
      return { 
        isValid: false, 
        message: "Please enter a valid URL" 
      };
    }
  };

  // Real-time URL validation
  useEffect(() => {
    if (targetUrl.trim() === "") {
      setUrlValidation({
        isValid: false,
        message: "",
        isTouched: urlValidation.isTouched,
      });
      return;
    }

    if (!urlValidation.isTouched) {
      // Don't show validation until user has interacted
      return;
    }

    const validation = validateUrlFormat(targetUrl);
    setUrlValidation({
      ...validation,
      isTouched: true,
    });
  }, [targetUrl, urlValidation.isTouched]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetUrl(value);
    
    // Mark as touched when user starts typing
    if (!urlValidation.isTouched && value.trim() !== "") {
      setUrlValidation(prev => ({ ...prev, isTouched: true }));
    }
  };

  const handleUrlBlur = () => {
    // Mark as touched when user leaves the field
    if (targetUrl.trim() !== "" && !urlValidation.isTouched) {
      setUrlValidation(prev => ({ ...prev, isTouched: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setGeneratedUrl("");

    // Final validation before submission using the same enhanced function
    const finalValidation = validateUrlFormat(targetUrl);
    if (!finalValidation.isValid) {
      setError(finalValidation.message || "Please enter a valid URL");
      setLoading(false);
      return;
    }

    if (shortCode && !isValidShortCode(shortCode)) {
      setError("Short code must be 6-8 alphanumeric characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUrl,
          shortCode: shortCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // FIXED: Use dynamic domain helper function
        const shortUrl = getShortUrl(data.link.shortCode);
        setGeneratedUrl(shortUrl);
        setSuccess("Link created successfully!");
        setTargetUrl("");
        setShortCode("");
        setUrlValidation({ isValid: false, message: "", isTouched: false });
        onLinkCreated();
      } else {
        setError(data.error || "Failed to create link");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Failed to create link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    setShortCode(generateShortCode());
  };

  const copyToClipboard = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setCopied(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoaded(false);
    setImageError(true);
  };

  const openGeneratedUrl = () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-8 duration-300">
          <div className="bg-[#450606] text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 border border-[#FDE8E8]/20">
            <Check className="w-5 h-5" />
            <span className="font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto pt-8 lg:pt-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen items-start">
          {/* Left Side - Text Content */}
          <div className="space-y-6 animate-in fade-in duration-700 lg:pr-4">
            {/* Header - Fixed responsive issues */}
            <div className="space-y-4 text-center lg:text-left">
              <div>
                <h1 className="text-3xl sm:text-4xl pb-2 md:text-5xl font-bold bg-gradient-to-r from-[#450606] to-[#5a0a0a] bg-clip-text text-transparent leading-relaxed sm:leading-relaxed">
                  Short Links, Big Impact
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#450606] leading-relaxed mt-2 sm:mt-2">
                  Transform long URLs into powerful, shareable connections
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#450606] bg-[#FDE8E8] px-3 py-2 rounded-full">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#450606] bg-[#FDE8E8]  px-3 py-2 rounded-full">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Easy Sharing</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#450606] bg-[#FDE8E8] px-3 py-2 rounded-full">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Custom Codes</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input with Real-time Validation */}
              <div className="space-y-2 transform transition-all duration-300 hover:scale-[1.02]">
                <label className="block text-sm font-semibold text-[#450606]">
                  Enter your URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={handleUrlChange}
                    onBlur={handleUrlBlur}
                    placeholder="https://example.com/very-long-url"
                    className={`w-full pl-4 pr-10 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm text-[#450606] placeholder-gray-400 transition-all duration-300 shadow-sm ${
                      urlValidation.isTouched
                        ? urlValidation.isValid
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#450606]"
                    }`}
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                    {urlValidation.isTouched && targetUrl && (
                      urlValidation.isValid ? (
                        <Check className="w-5 h-5  text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                    {(!urlValidation.isTouched || !targetUrl) && (
                      <Link2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Validation Message */}
                {urlValidation.isTouched && urlValidation.message && (
                  <p
                    className={`text-xs font-medium transition-all duration-300 ${
                      urlValidation.isValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {urlValidation.message}
                  </p>
                )}
                
                {/* URL Format Tips */}
                {!urlValidation.isTouched && (
                  <div className="text-xs text-gray-500">
                    <p>Kindly provide valid URLs, ensuring they begin with http:// or https://</p>
                    
                  </div>
                )}
              </div>

              {/* Custom Code Input */}
              <div className="space-y-2 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#450606]">
                    Custom code (optional)
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    disabled={loading}
                    className="flex items-center space-x-1 text-sm text-[#450606] hover:text-[#340505] font-medium transition-colors duration-200 group"
                  >
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Generate random</span>
                    <span className="sm:hidden">Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  placeholder="my-custom-link"
                  pattern="[A-Za-z0-9]{6,8}"
                  title="6-8 alphanumeric characters"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#450606] focus:border-transparent bg-white/80 backdrop-blur-sm text-[#450606] placeholder-gray-400 transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  6-8 alphanumeric characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !targetUrl || (urlValidation.isTouched && !urlValidation.isValid)}
                className="w-full py-4 bg-gradient-to-r from-[#450606] to-[#5a0a0a] text-white font-semibold rounded-xl hover:from-[#340505] hover:to-[#450606] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Create Short Link</span>
                  </>
                )}
              </button>
            </form>

            {/* Enhanced Results Section */}
            {success && generatedUrl && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-6 bg-gradient-to-br from-white to-[#FDE8E8]/30 backdrop-blur-sm border border-[#FDE8E8]/50 rounded-2xl shadow-2xl">
                  {/* Success Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-[#450606] rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[#450606] font-bold text-lg">Success!</p>
                      <p className="text-[#450606] text-sm">Your short link is ready</p>
                    </div>
                  </div>

                  {/* Generated URL Card */}
                  <div className="bg-white rounded-xl border border-[#FDE8E8] p-1 shadow-lg">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#450606] to-[#5a0a0a] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Link2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[#450606] font-mono text-sm sm:text-base break-all">
                            {generatedUrl}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Click to open or copy to share
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                        {/* Open Link Button */}
                        <button
                          onClick={openGeneratedUrl}
                          className="p-2 text-[#450606] hover:bg-[#FDE8E8] rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 border border-transparent hover:border-[#FDE8E8]"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={copyToClipboard}
                          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 border ${
                            copied 
                              ? 'bg-green-100 text-green-600 border-green-200' 
                              : 'text-[#450606] hover:bg-[#FDE8E8] border-transparent hover:border-[#FDE8E8]'
                          }`}
                          title="Copy to clipboard"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Enhanced Image with better loading handling */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-2xl">
              {/* Background decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#450606]/10 to-[#5a0a0a]/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-[#450606]/10 to-[#5a0a0a]/20 rounded-full blur-xl animate-pulse delay-1000"></div>

              {/* Main Image Container */}
              <div
                className={`relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-1000 ${
                  isImageLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                {/* Fallback if image fails to load */}
                {imageError ? (
                  <div className="w-full h-96 bg-gradient-to-br from-[#450606]/10 to-[#5a0a0a]/20 rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <Link2 className="w-16 h-16 text-[#450606] mx-auto mb-4" />
                      <p className="text-[#450606] font-semibold">TinyLink</p>
                      <p className="text-[#450606]/70 text-sm">URL Shortener</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src="/bg.png"
                      alt="URL Shortener Illustration"
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover rounded-3xl"
                      onLoadingComplete={handleImageLoad}
                      onError={handleImageError}
                    />

                    {/* Loading skeleton */}
                    {!isImageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl"></div>
                    )}
                  </>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#450606]/10 to-transparent"></div>

                {/* Floating elements */}
                <div className="absolute top-6 left-6 animate-bounce">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <Link2 className="w-6 h-6 text-[#450606]" />
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 animate-bounce delay-300">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-[#450606]" />
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#450606]">10M+</div>
                  <div className="text-sm text-gray-600">Links Created</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#450606]">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}