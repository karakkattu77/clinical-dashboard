"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Patient } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"

interface PopulationHistogramProps {
  patients: Patient[]
  selectedPatientId: number | null
}

export function PopulationHistogram({ patients, selectedPatientId }: PopulationHistogramProps) {
  // Create histogram bins
  const bins = [
    { range: "0-20%", min: 0, max: 20, count: 0, patients: [] as number[] },
    { range: "21-40%", min: 21, max: 40, count: 0, patients: [] as number[] },
    { range: "41-60%", min: 41, max: 60, count: 0, patients: [] as number[] },
    { range: "61-80%", min: 61, max: 80, count: 0, patients: [] as number[] },
    { range: "81-100%", min: 81, max: 100, count: 0, patients: [] as number[] },
  ]

  patients.forEach((patient) => {
    const dvtRisk = patient.risks.dvt
    const bin = bins.find((b) => dvtRisk >= b.min && dvtRisk <= b.max)
    if (bin) {
      bin.count++
      bin.patients.push(patient.patient_id)
    }
  })

  const selectedPatient = patients.find((p) => p.patient_id === selectedPatientId)
  const selectedBinIndex = selectedPatient
    ? bins.findIndex(
        (b) => selectedPatient.risks.dvt >= b.min && selectedPatient.risks.dvt <= b.max
      )
    : -1

  const getBarColor = (index: number) => {
    if (index === selectedBinIndex) return "#0ea5e9"
    if (index <= 1) return "#10b981"
    if (index <= 2) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Population DVT Risk Distribution
        </CardTitle>
        <CardDescription>
          Distribution of DVT/PE risk scores across all patients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium text-sm">DVT Risk: {item.range}</p>
                        <p className="text-lg font-bold">
                          {item.count} patient{item.count !== 1 ? "s" : ""}
                        </p>
                        {item.patients.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            IDs: {item.patients.join(", ")}
                          </p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {bins.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
              {selectedPatient && (
                <ReferenceLine
                  y={0}
                  stroke="transparent"
                  label={{
                    value: `Selected: Patient ${selectedPatientId}`,
                    position: "insideTopRight",
                    fill: "#0ea5e9",
                    fontSize: 11,
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-muted-foreground">Low Risk (0-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-muted-foreground">Moderate (41-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">High Risk (61-100%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
