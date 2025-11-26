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
  // Filter out fully operational days and only show days with issues
  const filteredTimeline = timeline.filter(entry => entry.status !== 'operational')
  
  // Check if all days were operational
  const allOperational = timeline.every(entry => entry.status === 'operational')
  const operationalDaysCount = timeline.filter(entry => entry.status === 'operational').length

  return (
    <Card className="p-6 border-slate-300 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-black" />
        <h3 className="text-lg font-semibold text-black">Last 7 Days Overview</h3>
      </div>

      {allOperational ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-lg font-light text-black mb-2">All Services Operational</p>
          <p className="text-sm text-black font-light">
            No outages or degradation detected in the last 7 days
          </p>
        </div>
      ) : filteredTimeline.length > 0 ? (
        <div className="space-y-4">
          {filteredTimeline.map((entry, index) => {
            const config = statusConfig[entry.status]
            const Icon = config.icon
            
            return (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                {/* Date Column */}
                <div className="flex-shrink-0 w-24">
                  <div className={`text-sm font-medium ${entry.is_today ? 'text-blue-600' : 'text-black'}`}>
                    {entry.day_name}
                  </div>
                  <div className="text-xs text-black font-light">
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
                          <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-light">
                            {outage.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-lg font-light text-black mb-2">All Services Operational</p>
          <p className="text-sm text-black font-light">
            No outages or degradation detected in the last 7 days
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-black font-light">Summary:</span>
          <span className="text-black font-semibold">
            {operationalDaysCount}/7 days fully operational
          </span>
        </div>
      </div>
    </Card>
  )
}