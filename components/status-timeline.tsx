"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface TimelineEntry {
  time: string
  status: string
  response_time: number
}

const statusColors = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-red-500",
}

export default function StatusTimeline({ history }: { history: TimelineEntry[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Card className="p-4 border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Today's Status Timeline</h3>

      {/* Timeline Visualization */}
      <div className="flex items-end gap-1 h-24 mb-3 bg-slate-50 p-3 rounded-lg">
        {history.length > 0 ? (
          history.map((entry, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {hoveredIndex === idx && (
                <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-semibold">{entry.time}</div>
                  <div>
                    {entry.status} · {entry.response_time}ms
                  </div>
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all ${
                  statusColors[entry.status as keyof typeof statusColors] || "bg-slate-300"
                } ${hoveredIndex === idx ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                style={{ height: `${Math.min(100, (entry.response_time / 1000) * 100)}%`, minHeight: "4px" }}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-slate-500 text-sm font-light">No data available</div>
        )}
      </div>

      {/* Time Labels */}
      <div className="flex justify-between text-xs text-slate-500 font-light">
        {history.length > 0 ? (
          <>
            <span>{history[0]?.time}</span>
            <span>{history[Math.floor(history.length / 2)]?.time}</span>
            <span>{history[history.length - 1]?.time}</span>
          </>
        ) : null}
      </div>
    </Card>
  )
}