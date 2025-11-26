"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  Clock,
  Server,
  Wifi,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ServiceCard from "@/components/service-card";
import StatusTimeline from "@/components/status-timeline";
import TimeSeriesHistory from "@/components/time-series-history";

interface Service {
  name: string;
  description: string;
  current_status: "operational" | "degraded" | "outage";
  response_time: number;
  uptime_today: number;
  today_history: Array<{
    time: string;
    status: string;
    response_time: number;
  }>;
  last_7_days_timeline: Array<{
    date: string
    day_name: string
    status: 'operational' | 'mixed' | 'outage'
    outage_count: number
    outage_details: Array<{
      start_time: string
      end_time: string
      duration: string
      status: string
    }>
    is_today: boolean
  }>;
  last_checked_display: string;
  timezone: string;
}

interface ApiResponse {
  services: Service[];
  last_updated_display: string;
  timezone: string;
}

export default function StatusDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8001/api/status/";

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      console.error("Status fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const handleManualRefresh = () => {
    fetchStatus();
  };

  // Calculate overall system status
  const overallStatus = data?.services.every(
    (service) => service.current_status === "operational"
  )
    ? "operational"
    : data?.services.some((service) => service.current_status === "outage")
    ? "outage"
    : "degraded";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white">
                <Image
                  src="/logo.png"
                  alt="Learn DevOps Now Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Service Status
              </h1>
              <p className="text-black mt-1 text-lg">
                Learn DevOps Now
              </p>
            </div>
          </div>

          {/* Status Badge & Refresh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${
                overallStatus === "operational"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : overallStatus === "degraded"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  overallStatus === "operational"
                    ? "bg-green-500"
                    : overallStatus === "degraded"
                    ? "bg-amber-500"
                    : "bg-red-500"
                } animate-pulse`}
              ></div>
              {overallStatus === "operational"
                ? "All Systems Operational"
                : overallStatus === "degraded"
                ? "Partial Degradation"
                : "Service Outage"}
            </div>

            <Button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3 font-semibold"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh Status"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {data && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-black mb-1">
                <Server className="w-4 h-4" />
                <span className="text-sm font-medium">Services</span>
              </div>
              <div className="text-3xl font-light text-black">
                {data.services.length}
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-black mb-1">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Operational</span>
              </div>
              <div className="text-3xl font-light text-green-600">
                {
                  data.services.filter(
                    (s) => s.current_status === "operational"
                  ).length
                }
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-black mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Avg Response</span>
              </div>
              <div className="text-3xl font-light text-blue-600">
                {Math.round(
                  data.services.reduce(
                    (acc, service) => acc + service.response_time,
                    0
                  ) / data.services.length
                )}
                ms
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Last Updated</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">
                    {data.last_updated_display}
                  </div>
                  <div className="text-xs text-black">UTC</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="bg-red-50 border-red-200 p-6 shadow-lg">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 text-lg mb-2">
                  Connection Error
                </h3>
                <p className="text-red-700 mb-3">{error}</p>
                <div className="text-sm text-red-600 bg-red-100 rounded-lg p-3">
                  <p className="font-medium mb-1">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check if Django server is running on port 8001</li>
                    <li>Verify CORS settings in Django</li>
                    <li>Ensure API endpoint is correct: {apiEndpoint}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Simplified Loading State */}
      {loading && !data && (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="w-32 h-32 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Learn DevOps Now Logo"
                width={120}
                height={120}
                className="opacity-80 animate-pulse"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-black text-lg font-medium">Loading services status...</p>
        </div>
      )}

      {/* Services Grid */}
      {data && !loading && (
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {data.services.map((service, index) => (
              <div key={service.name} className="space-y-6">
                <ServiceCard service={service} />
                <div className="grid gap-4">
                  <StatusTimeline history={service.today_history} />
                  <TimeSeriesHistory timeline={service.last_7_days_timeline} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-black text-sm bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200">
              <Wifi className="w-4 h-4" />
              <span>
                All times in UTC
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}