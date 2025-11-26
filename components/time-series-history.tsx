"use client"

import { Card } from "@/components/ui/card"
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface TimelineEntry {
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
}

const statusConfig = {
  operational: {
    color: "bg-emerald-500",
    icon: CheckCircle,
    label: "Fully Operational"
  },
  mixed: {
    color: "bg-amber-500", 
    icon: AlertTriangle,
    label: "Partial Outages"
  },
  outage: {
    color: "bg-red-500",
    icon: XCircle,
    label: "Major Outage"
  }
}

export default function TimeSeriesHistory({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <Card className="p-6 border-slate-300 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-black" />
        <h3 className="text-lg font-semibold text-black">Last 7 Days Performance</h3>
      </div>

      <div className="space-y-4">
        {timeline.map((entry, index) => {
          const config = statusConfig[entry.status]
          const Icon = config.icon
          
          return (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              {/* Date Column */}
              <div className="flex-shrink-0 w-24">
                <div className={`text-sm font-medium ${entry.is_today ? 'text-blue-600' : 'text-black'}`}>
                  {entry.day_name}
                </div>
                <div className="text-xs text-black">
                  {entry.date}
                </div>
                {entry.is_today && (
                  <div className="text-xs text-blue-500 font-medium mt-1">Today</div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${config.color} mt-1`} />
              </div>

              {/* Timeline Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-black" />
                  <span className="text-sm font-medium text-black">
                    {config.label}
                  </span>
                  {entry.outage_count > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {entry.outage_count} outage{entry.outage_count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Outage Details */}
                {entry.outage_details.length > 0 && (
                  <div className="space-y-2">
                    {entry.outage_details.map((outage, outageIndex) => (
                      <div key={outageIndex} className="flex items-center gap-3 text-sm text-black bg-red-50 rounded-lg px-3 py-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium">{outage.start_time}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{outage.end_time}</span>
                        </div>
                        <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          {outage.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Operational Day */}
                {entry.status === 'operational' && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-emerald-50 rounded-lg px-3 py-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>24 hours operational</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span>Operational</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>Partial Outages</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Major Outage</span>
        </div>
      </div>
    </Card>
  )
}