"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface VitalsChartProps {
  vitals: {
    hr: number
    map: number
    spo2: number
    rr: number
  }
}

const normalRanges = {
  HR: { min: 60, max: 100, unit: "bpm" },
  MAP: { min: 70, max: 100, unit: "mmHg" },
  SpO2: { min: 95, max: 100, unit: "%" },
  RR: { min: 12, max: 20, unit: "/min" },
}

function getVitalStatus(name: string, value: number): "normal" | "warning" | "critical" {
  const range = normalRanges[name as keyof typeof normalRanges]
  if (!range) return "normal"
  
  if (value >= range.min && value <= range.max) return "normal"
  
  const deviation = value < range.min 
    ? (range.min - value) / range.min 
    : (value - range.max) / range.max
    
  return deviation > 0.15 ? "critical" : "warning"
}

function getBarColor(status: "normal" | "warning" | "critical") {
  switch (status) {
    case "normal":
      return "#10b981"
    case "warning":
      return "#f59e0b"
    case "critical":
      return "#ef4444"
  }
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  const data = [
    { name: "HR", value: vitals.hr, fullName: "Heart Rate", unit: "bpm" },
    { name: "MAP", value: vitals.map, fullName: "Mean Arterial Pressure", unit: "mmHg" },
    { name: "SpO2", value: vitals.spo2, fullName: "Oxygen Saturation", unit: "%" },
    { name: "RR", value: vitals.rr, fullName: "Respiratory Rate", unit: "/min" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Current Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    const status = getVitalStatus(item.name, item.value)
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium text-sm">{item.fullName}</p>
                        <p className="text-lg font-bold">
                          {item.value} {item.unit}
                        </p>
                        <p className={`text-xs capitalize ${
                          status === "normal" ? "text-emerald-600" :
                          status === "warning" ? "text-amber-600" : "text-red-600"
                        }`}>
                          {status}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(getVitalStatus(entry.name, entry.value))}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {data.map((vital) => {
            const status = getVitalStatus(vital.name, vital.value)
            return (
              <div 
                key={vital.name}
                className="text-center p-2 rounded-lg bg-muted/50"
              >
                <p className="text-xs text-muted-foreground">{vital.name}</p>
                <p className={`text-sm font-semibold ${
                  status === "normal" ? "text-emerald-600" :
                  status === "warning" ? "text-amber-600" : "text-red-600"
                }`}>
                  {vital.value} {vital.unit}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
