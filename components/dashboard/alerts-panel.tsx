"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  alerts: string[]
}

function getAlertSeverity(alert: string): "critical" | "moderate" {
  const criticalKeywords = ["critical", "high", "immediate", "low spo2", "tachycardia"]
  const lowerAlert = alert.toLowerCase()
  return criticalKeywords.some(keyword => lowerAlert.includes(keyword))
    ? "critical"
    : "moderate"
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          Active Alerts
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">No active alerts</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((alert, index) => {
              const severity = getAlertSeverity(alert)
              return (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium flex items-start gap-2 transition-all",
                    severity === "critical"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 w-2 h-2 rounded-full mt-1.5",
                      severity === "critical" ? "bg-red-500" : "bg-amber-500"
                    )}
                  />
                  {alert}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
