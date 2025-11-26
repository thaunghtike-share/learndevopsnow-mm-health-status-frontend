"use client"

import { CheckCircle, AlertCircle, XCircle, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Service {
  name: string
  description: string
  current_status: "operational" | "degraded" | "outage"
  response_time: number
  uptime_today: number
  last_checked_display: string
  timezone: string
}

const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Operational",
    badge: "bg-emerald-100 text-emerald-700",
  },
  degraded: {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Degraded",
    badge: "bg-amber-100 text-amber-700",
  },
  outage: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Outage",
    badge: "bg-red-100 text-red-700",
  },
}

export default function ServiceCard({ service }: { service: Service }) {
  const config = statusConfig[service.current_status]
  const StatusIcon = config.icon

  const uptrendTrend = service.uptime_today >= 95 ? "↑" : service.uptime_today >= 75 ? "→" : "↓"

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-black text-balance">{service.name}</h2>
          <p className="text-sm text-black mt-1">{service.description}</p>
        </div>
        <div className={`p-3 rounded-lg ${config.bg}`}>
          <StatusIcon className={`w-6 h-6 ${config.color}`} />
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${config.badge}`}>
        {config.label}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Response Time */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-black font-medium">Response Time</span>
          </div>
          <p className="text-2xl font-bold text-black">{service.response_time}</p>
          <p className="text-xs text-black">milliseconds</p>
        </div>

        {/* Uptime */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-black font-medium">Today's Uptime</span>
          </div>
          <p className="text-2xl font-bold text-black">{service.uptime_today.toFixed(1)}%</p>
          <p className="text-xs text-black">{uptrendTrend} Trend</p>
        </div>
      </div>

      {/* Last Checked */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Last checked:</span>
          <div className="text-right">
            <p className="font-semibold text-black">{service.last_checked_display}</p>
            <p className="text-xs text-black">{service.timezone}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
