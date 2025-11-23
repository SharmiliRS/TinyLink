import { useState, useEffect } from "react";
import { Link as LinkType } from "@/../lib/types";
import { formatDate } from "@/../lib/utils";
import {
  Copy,
  Trash2,
  Search,
  Filter,
  Link2,
  Calendar,
  MousePointer,
  Check,
  X,
  Activity,
  ExternalLink,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface LinksTableProps {
  refresh: number;
}

export function LinksTable({ refresh }: LinksTableProps) {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"clicks" | "date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    link: LinkType | null;
  }>({ isOpen: false, link: null });
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [refresh]);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links");
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else {
        console.error("Failed to fetch links");
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLinkStatus = (link: LinkType) => {
    const now = new Date();
    const lastClick = link.lastClicked ? new Date(link.lastClicked) : null;
    const daysSinceLastClick = lastClick
      ? Math.floor(
          (now.getTime() - lastClick.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;

    if (link.clicks === 0) {
      return {
        status: "inactive",
        label: "⏳ No clicks",
        color: "bg-gray-100 text-gray-800 border-2 border-gray-300",
        description: "Never been clicked",
        icon: "⏳",
      };
    }

    if (daysSinceLastClick !== null && daysSinceLastClick <= 1) {
      return {
        status: "very-active",
        label: "🔥 Hot",
        color: "bg-white text-red-800 border-2 border-red-500",
        description: `Clicked today (${link.clicks} total)`,
        icon: "🔥",
      };
    }

    if (daysSinceLastClick !== null && daysSinceLastClick <= 7) {
      return {
        status: "active",
        label: "🚀 Active",
        color: "bg-green-100 text-green-800 border-2 border-green-300",
        description: `Clicked ${daysSinceLastClick} days ago`,
        icon: "🚀",
      };
    }

    if (daysSinceLastClick !== null && daysSinceLastClick <= 30) {
      return {
        status: "dormant",
        label: "💤 Dormant",
        color: "bg-yellow-100 text-yellow-800 border-2 border-yellow-300",
        description: `Clicked ${daysSinceLastClick} days ago`,
        icon: "💤",
      };
    }

    return {
      status: "inactive-old",
      label: "📭 Old",
      color: "bg-gray-100 text-gray-700 border-2 border-gray-400",
      description: `Last click was ${daysSinceLastClick} days ago`,
      icon: "📭",
    };
  };

  const openDeleteDialog = (link: LinkType) => {
    setDeleteDialog({ isOpen: true, link });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, link: null });
  };

  const handleDelete = async () => {
    if (!deleteDialog.link) return;

    const shortCode = deleteDialog.link.shortCode;
    setDeleting(shortCode);

    try {
      const response = await fetch(`/api/links/${shortCode}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLinks(links.filter((link) => link.shortCode !== shortCode));
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 3000);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));

        if (response.status === 404) {
          fetchLinks();
        } else {
          console.error("Failed to delete link:", errorData.error);
        }
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setDeleting(null);
      closeDeleteDialog();
    }
  };

  const copyToClipboard = async (text: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(shortCode);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard");
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case "clicks":
        aValue = a.clicks;
        bValue = b.clicks;
        break;
      case "date":
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      case "name":
        aValue = a.shortCode.toLowerCase();
        bValue = b.shortCode.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === "desc") {
      return aValue < bValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="rounded-3xl p-4 md:p-8 animate-in fade-in duration-500">
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-3">
              <div className="h-8 bg-[#FDE8E8] rounded-2xl w-48 md:w-64"></div>
              <div className="h-4 bg-[#FDE8E8] rounded-lg w-36 md:w-48"></div>
            </div>
            <div className="h-12 bg-[#FDE8E8] rounded-2xl w-full md:w-80"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-[#FDE8E8]/50 rounded-2xl"
              >
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-[#FDE8E8] rounded-lg w-3/4"></div>
                  <div className="h-4 bg-[#FDE8E8]/80 rounded-lg w-1/2"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-9 bg-[#FDE8E8] rounded-xl w-20"></div>
                  <div className="h-9 bg-[#FDE8E8] rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden animate-in fade-in duration-500">
      {/* Delete Success Toast */}
      {showDeleteToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-8 duration-300">
          <div className="bg-[#450606] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border-2 border-[#450606]">
            <Check className="w-5 h-5" />
            <span className="font-bold">Link deleted successfully!</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && deleteDialog.link && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in duration-300 border-2 border-red-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-800">
                Delete Short Link
              </h3>
              <button
                onClick={closeDeleteDialog}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-700 mb-4 font-medium">
              Are you sure you want to permanently delete this short link?
            </p>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Link2 className="w-4 h-4 text-red-600" />
                <p className="text-lg font-bold text-red-800">
                  {deleteDialog.link.shortCode}
                </p>
              </div>
              <p className="text-sm text-red-700 break-all font-medium">
                {deleteDialog.link.targetUrl}
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ This will permanently delete all analytics data for this
                link.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeDeleteDialog}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                disabled={deleting !== null}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting !== null}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="pb-6 pl-2 pt-4 border-b border-[#450606]/10  bg-[#fffcfc]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-3 text-[#450606] hover:bg-white rounded-xl transition-all duration-200 border-2 border-transparent hover:border-[#450606]/20 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#450606]">
                Your Short Links
              </h1>
              <p className="text-[#450606]/60 text-lg">
                Manage and track all your shortened URLs
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort Controls */}
            <div className="flex items-center space-x-3 bg-white border-2 border-[#450606]/20 rounded-xl px-4 py-3">
              <Filter className="w-4 h-4 text-[#450606]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-[#450606] focus:outline-none focus:ring-0 font-bold cursor-pointer text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="clicks">Sort by Clicks</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#450606]" />
              <input
                type="text"
                placeholder="Search links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#450606]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#450606] focus:border-transparent transition-all duration-300 text-[#450606] placeholder-[#450606]/50 font-bold text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {sortedLinks.length === 0 ? (
        <div className="p-12 md:p-16 text-center bg-[#fffcfc]">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#450606]/20">
            <Link2 className="w-8 h-8 text-[#450606]" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#450606] mb-3">
            {links.length === 0
              ? "No links created yet"
              : "No matching links found"}
          </h3>
          <p className="text-[#450606]/80 text-base max-w-md mx-auto font-medium">
            {links.length === 0
              ? "Create your first short link to get started with URL tracking!"
              : "Try adjusting your search terms to find what you're looking for"}
          </p>
        </div>
      ) : (
        <div className="py-4 space-y-4 sm:px-4 bg-[#fffcfc]">
          {sortedLinks.map((link, index) => {
            const statusInfo = getLinkStatus(link);
            const fullShortUrl = `${window.location.origin}/${link.shortCode}`;

            return (
              <div
                key={link.id}
                className="group bg-[#FDE8E8] border-2 border-[#450606]/10 rounded-2xl p-6 hover:border-[#450606]/30 transition-all duration-300 animate-in fade-in shadow-lg hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Main Link Content */}
                  <div className="flex-1 space-y-4 min-w-0">
                    {/* URL Sections */}
                    <div className="space-y-4">
                      {/* Short URL Section */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Link2 className="w-6 h-6 text-[#450606]" />
                          <span className="text-lg font-bold text-[#450606] uppercase tracking-wide">
                            Short URL
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex-1 bg-[#fffcfc] px-3 py-2 rounded-lg border-2 border-[#450606]/20">
                            <div className="flex items-center justify-between">
                              <span className="text-md font-semibold text-[#450606] break-all">
                                {fullShortUrl}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(fullShortUrl, link.shortCode)
                                }
                                className="flex-shrink-0 ml-2 p-1 text-[#450606] hover:bg-white rounded transition-all duration-200"
                                title="Copy short URL"
                                disabled={deleting === link.shortCode}
                              >
                                {copiedLink === link.shortCode ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:pl-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Original URL Section */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="w-6 h-6 text-[#450606]" />
                          <span className="text-lg font-bold text-[#450606] uppercase tracking-wide">
                            Original URL
                          </span>
                        </div>
                        <div
                          className="bg-[#fffcfc] px-3 py-2 rounded-lg border-2 border-[#450606]/20 cursor-pointer hover:border-[#450606]/50 transition-colors duration-200"
                          onClick={() => window.open(link.targetUrl, "_blank")}
                        >
                          <span className="text-md font-semibold text-[#450606] break-all">
                            {link.targetUrl}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs text-[#450606]">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Created: {formatDate(link.createdAt)}
                        </span>
                      </div>
                      {link.lastClicked && (
                        <div className="flex items-center space-x-2 text-xs text-[#450606]">
                          <MousePointer className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Last click: {formatDate(link.lastClicked)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats and Actions Sidebar - Vertically Centered */}
                  <div className="flex flex-col items-center space-y-4 lg:w-40">
                    {/* Click Stats */}
                    <div className="w-full bg-[#450606] text-white rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <MousePointer className="w-4 h-4" />
                        <span className="text-xl font-bold">{link.clicks}</span>
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wide">
                        Total Clicks
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full space-y-2">
                      <Link
                        href={`/code/${link.shortCode}`}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#450606] text-white rounded-lg hover:bg-[#340505] transition-all duration-200 font-semibold text-sm border-2 border-[#450606] shadow-lg"
                      >
                        <Activity className="w-4 h-4" />
                        <span>View Stats</span>
                      </Link>

                      <button
                        onClick={() => openDeleteDialog(link)}
                        disabled={deleting === link.shortCode}
                        className="flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border-2 border-red-300 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Stats */}
      {sortedLinks.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center space-x-4 font-medium text-gray-700">
              <span>
                Total Links:{" "}
                <strong className="text-[#450606]">{links.length}</strong>
              </span>
              <span>
                Total Clicks:{" "}
                <strong className="text-[#450606]">
                  {links.reduce((sum, link) => sum + link.clicks, 0)}
                </strong>
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 text-[#450606] px-3 py-1 rounded-full border border-gray-300 font-medium">
                Sorted by {sortBy} ({sortOrder})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
