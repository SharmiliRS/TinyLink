"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LinksTable } from "@/components/LinkTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <div className="min-h-screen bg-[#fffcfc]">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}

          {/* Links table */}
          <LinksTable refresh={refresh} />
        </div>
      </div>
    </>
  );
}
