"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react"

interface RiskCardProps {
  title: string
  riskPercentage: number
  description?: string
}

function getRiskLevel(percentage: number) {
  if (percentage < 30) return "low"
  if (percentage <= 70) return "moderate"
  return "high"
}

function getRiskColor(level: "low" | "moderate" | "high") {
  switch (level) {
    case "low":
      return "text-emerald-600 bg-emerald-50 border-emerald-200"
    case "moderate":
      return "text-amber-600 bg-amber-50 border-amber-200"
    case "high":
      return "text-red-600 bg-red-50 border-red-200"
  }
}

function getRiskIcon(level: "low" | "moderate" | "high") {
  switch (level) {
    case "low":
      return <ShieldCheck className="h-5 w-5" />
    case "moderate":
      return <AlertCircle className="h-5 w-5" />
    case "high":
      return <AlertTriangle className="h-5 w-5" />
  }
}

function getRiskLabel(level: "low" | "moderate" | "high") {
  switch (level) {
    case "low":
      return "Low Risk"
    case "moderate":
      return "Moderate Risk"
    case "high":
      return "High Risk"
  }
}

export function RiskCard({ title, riskPercentage, description }: RiskCardProps) {
  const level = getRiskLevel(riskPercentage)
  const colorClasses = getRiskColor(level)

  return (
    <Card className={cn("border-2 transition-all duration-300", colorClasses)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          {getRiskIcon(level)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{riskPercentage}%</span>
          <span className="text-sm font-medium">{getRiskLabel(level)}</span>
        </div>
        {description && (
          <p className="text-xs mt-2 opacity-80">{description}</p>
        )}
        <div className="mt-3 h-2 bg-background/50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              level === "low" && "bg-emerald-500",
              level === "moderate" && "bg-amber-500",
              level === "high" && "bg-red-500"
            )}
            style={{ width: `${riskPercentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
