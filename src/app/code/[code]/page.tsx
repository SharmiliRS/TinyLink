"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Link as LinkType } from "@/../lib/types";
import { formatDate } from "@/../lib/utils";
import {
  ArrowLeft,
  Link2,
  MousePointer,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

export default function StatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    desktop: 0,
    mobile: 0,
    tablet: 0,
    other: 0,
  });

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      const response = await fetch(`/api/links/${code}`);
      if (response.ok) {
        const data = await response.json();
        setLink(data);

        // Simulate device stats (you'll replace this with real data)
        const simulatedDeviceStats = {
          desktop: Math.floor(data.clicks * 0.6),
          mobile: Math.floor(data.clicks * 0.35),
          tablet: Math.floor(data.clicks * 0.04),
          other:
            data.clicks -
            Math.floor(data.clicks * 0.6) -
            Math.floor(data.clicks * 0.35) -
            Math.floor(data.clicks * 0.04),
        };
        setDeviceStats(simulatedDeviceStats);
      } else {
        setError("Link not found");
      }
    } catch (err) {
      setError("Failed to load link statistics");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${link.shortCode}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard");
    }
  };

  const getDevicePercentage = (deviceClicks: number) => {
    if (link?.clicks === 0) return 0;
    return Math.round((deviceClicks / (link?.clicks || 1)) * 100);
  };

  if (loading) {
    return (
      <div className=" bg-[#fffcfc]">
        <div className=" px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[#450606]/10 rounded-xl w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 space-y-3 border-2 border-[#450606]/10"
                >
                  <div className="h-4 bg-[#450606]/10 rounded-lg w-20" ></div>
                  <div className="h-6 bg-[#450606]/10 rounded-lg w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDE8E8] to-[#FDE8E8]/60 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#450606]/20">
            <Link2 className="w-10 h-10 text-[#450606]" />
          </div>
          <h2 className="text-2xl font-bold text-[#450606]">Link Not Found</h2>
          <p className="text-[#450606]/70">
            The requested link could not be found.
          </p>
          <Link
            href="/analytics"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#450606] text-white rounded-xl hover:bg-[#340505] transition-all duration-200 border-2 border-[#450606] shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analytics</span>
          </Link>
        </div>
      </div>
    );
  }

  const fullShortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <div className="  bg-[#fffcfc]">
      <div className=" px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/analytics"
              className="p-3 text-[#450606] hover:bg-white rounded-xl transition-all duration-200 border-2 border-transparent hover:border-[#450606]/20 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#450606]">
                Link Analytics
              </h1>
              <p className="text-[#450606]/60 text-lg">
                Detailed statistics for your short link
              </p>
            </div>
          </div>
        </div>

        {/* Link Info Card */}
        <div className="bg-[#FDE8E8]  rounded-2xl p-6 mb-8 border-2 border-[#450606]/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Link Details */}
            <div className="flex-1 space-y-6">
              {/* Short URL Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-8 bg-[#450606] rounded-xl flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#450606] uppercase tracking-wide ">
                    Short URL
                  </span>
                </div>
                <div className=" bg-[#fffcfc] px-4 py-3 rounded-xl border-2 border-[#450606]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#450606] break-all">
                      {fullShortUrl}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="flex-shrink-0 ml-3 p-2 text-[#450606] hover:bg-white rounded-lg transition-all duration-200 transform hover:scale-110 border-2 border-transparent hover:border-[#450606]/30"
                      title="Copy short URL"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Original URL Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-8 bg-[#450606] rounded-xl flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#450606] uppercase tracking-wide ">
                    Original URL
                  </span>
                </div>
                <div
                  className=" bg-[#fffcfc] px-4 py-3 rounded-xl border-2 border-[#450606]/20 cursor-pointer hover:border-[#450606]/50 transition-all duration-200"
                  onClick={() => window.open(link.targetUrl, "_blank")}
                >
                  <span className="text-base font-bold text-[#450606] break-all">
                    {link.targetUrl}
                  </span>
                </div>
              </div>

              {/* Metadata */}
            </div>

            {/* Quick Stats */}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clicks */}
          <div className="bg-[#FDE8E8]  rounded-2xl p-6 border-2 border-[#450606]/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#450606] rounded-xl flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#450606]/60 text-sm font-bold">
                  Total Clicks
                </p>
                <h3 className="text-2xl font-bold text-[#450606]">
                  {link.clicks}
                </h3>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#FDE8E8]  rounded-2xl p-6 border-2 border-[#450606]/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#450606] rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#450606]/60 text-sm font-bold">Status</p>
                <h3 className="text-xl font-bold text-[#450606]">
                  {link.clicks > 0 ? "Active" : "Inactive"}
                </h3>
              </div>
            </div>
          </div>

          {/* Last Click */}
          <div className="bg-[#FDE8E8]  rounded-2xl p-6 border-2 border-[#450606]/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#450606] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#450606]/60 text-sm font-bold">
                  Last Click
                </p>
                <h3 className="text-lg font-bold text-[#450606]">
                  {link.lastClicked ? formatDate(link.lastClicked) : "Never"}
                </h3>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="bg-[#FDE8E8]  rounded-2xl p-6 border-2 border-[#450606]/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#450606] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#450606]/60 text-sm font-bold">Created</p>
                <h3 className="text-lg font-bold text-[#450606]">
                  {formatDate(link.createdAt)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
