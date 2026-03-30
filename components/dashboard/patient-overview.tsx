"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Patient } from "@/lib/types"
import { User, FileText } from "lucide-react"

interface PatientOverviewProps {
  patient: Patient
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  const hasAlerts = patient.alerts.length > 0
  const highRisk = patient.risks.dvt > 70 || patient.risks.pressure_injury > 70

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Patient {patient.patient_id}</h2>
                {highRisk && (
                  <Badge variant="destructive" className="text-xs">
                    High Risk
                  </Badge>
                )}
                {hasAlerts && !highRisk && (
                  <Badge className="bg-amber-500 text-white text-xs">
                    Active Alerts
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Admission ID: {patient.hadm_id}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Last Updated</p>
            <p className="font-medium text-foreground">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
