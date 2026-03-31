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
        // Deduplicate by patient_id, keep first occurrence
        const seen = new Set()
        const unique = data.filter((p: Patient) => {
          if (seen.has(p.patient_id)) return false
          seen.add(p.patient_id)
          return true
        })
        setPatients(unique)
        if (unique.length > 0) {
          setSelectedPatientId(unique[0].patient_id)
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
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4f8 0%, #e8edf5 100%)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 shadow-lg" style={{ background: "linear-gradient(90deg, #041E42 0%, #0a2d5e 100%)", borderBottom: "3px solid #9E7E38" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Logo on gold background */}
              <div className="rounded-lg overflow-hidden px-3 py-1.5" style={{ background: "#C4A35A" }}>
                <img
                  src="/gu-medstar-logo.avif"
                  alt="Georgetown MedStar Logo"
                  className="h-9 w-auto block"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div className="border-l pl-5" style={{ borderColor: "#9E7E38" }}>
                <h1 className="text-base font-bold text-white leading-tight tracking-wide">
                  Clinical Risk Monitoring Dashboard
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "#C4A35A" }}>
                  ICU Patient Risk Assessment · Georgetown University Medical Center
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(196,163,90,0.15)", color: "#C4A35A", border: "1px solid rgba(196,163,90,0.3)" }}>
              <Heart className="h-3.5 w-3.5" />
              MedStar Health
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-lg sticky top-24" style={{ background: "#041E42" }}>
              {/* Sidebar header */}
              <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(196,163,90,0.25)" }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C4A35A" }}>Patient Selection</p>
              </div>
              <div className="p-4">
                <PatientSelector
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                  onSelectPatient={setSelectedPatientId}
                />
              </div>

              {/* Quick Stats */}
              <div className="px-4 pb-5" style={{ borderTop: "1px solid rgba(196,163,90,0.15)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mt-4 mb-3" style={{ color: "#C4A35A" }}>
                  Census Summary
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <span className="text-xs text-blue-200">Total Patients</span>
                    <span className="text-sm font-bold text-white">{patients.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ background: "rgba(239,68,68,0.1)" }}>
                    <span className="text-xs text-red-300">High Risk</span>
                    <span className="text-sm font-bold text-red-400">
                      {patients.filter((p) => p.risks.dvt > 70 || p.risks.pressure_injury > 70).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg" style={{ background: "rgba(245,158,11,0.1)" }}>
                    <span className="text-xs text-amber-300">With Alerts</span>
                    <span className="text-sm font-bold text-amber-400">
                      {patients.filter((p) => p.alerts.length > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-5">
            {selectedPatient ? (
              <>
                <PatientOverview patient={selectedPatient} />
                <PhysicianNote patient={selectedPatient} />

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <AlertsPanel alerts={selectedPatient.alerts} />
                  <VitalsChart vitals={selectedPatient.vitals} />
                </div>

                <PopulationHistogram
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">No Patient Selected</h2>
                <p className="text-muted-foreground">Select a patient from the sidebar to view their risk assessment.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
