"use client"

import { useState, useEffect } from "react"
import { Patient } from "@/lib/types"
import { PatientSelector } from "./patient-selector"
import { PatientOverview } from "./patient-overview"
import { RiskCard } from "./risk-card"
import { AlertsPanel } from "./alerts-panel"
import { VitalsChart } from "./vitals-chart"
import { PopulationHistogram } from "./population-histogram"
import { Activity, Heart } from "lucide-react"
import { PhysicianNote } from "./physician-note"

export function ClinicalDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch("/frontend_data.json")
        const data = await response.json()
        setPatients(data)
        if (data.length > 0) {
          setSelectedPatientId(data[0].patient_id)
        }
      } catch (error) {
        console.error("Failed to load patient data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPatients()
  }, [])

  const selectedPatient = patients.find((p) => p.patient_id === selectedPatientId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="h-6 w-6 animate-pulse" />
          <span className="text-lg">Loading patient data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Clinical Risk Monitoring Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                ICU Patient Risk Assessment System
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-background rounded-xl border p-4 sticky top-24">
              <PatientSelector
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
              />
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Patients</span>
                    <span className="font-semibold">{patients.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">High Risk</span>
                    <span className="font-semibold text-red-600">
                      {patients.filter((p) => p.risks.dvt > 70 || p.risks.pressure_injury > 70).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">With Alerts</span>
                    <span className="font-semibold text-amber-600">
                      {patients.filter((p) => p.alerts.length > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {selectedPatient ? (
              <>
                {/* Patient Overview */}
                <PatientOverview patient={selectedPatient} />

                {/* Physician Note */}
                <PhysicianNote patient={selectedPatient} />

                {/* Risk Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RiskCard
                    title="DVT / PE Risk"
                    riskPercentage={selectedPatient.risks.dvt}
                    description="Deep Vein Thrombosis / Pulmonary Embolism"
                  />
                  <RiskCard
                    title="Pressure Injury Risk"
                    riskPercentage={selectedPatient.risks.pressure_injury}
                    description="Risk of developing pressure ulcers"
                  />
                </div>

                {/* Alerts and Vitals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AlertsPanel alerts={selectedPatient.alerts} />
                  <VitalsChart vitals={selectedPatient.vitals} />
                </div>

                {/* Population View */}
                <PopulationHistogram
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                />
              </>
            ) : (
              <div className="bg-background rounded-xl border p-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">No Patient Selected</h2>
                <p className="text-muted-foreground">
                  Select a patient from the sidebar to view their risk assessment.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
