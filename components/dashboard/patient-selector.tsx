"use client"

import { useState, useMemo } from "react"
import { Patient } from "@/lib/types"
import { User } from "lucide-react"

interface PatientSelectorProps {
  patients: Patient[]
  selectedPatientId: number | null
  onSelectPatient: (patientId: number) => void
}

export function PatientSelector({
  patients,
  selectedPatientId,
  onSelectPatient,
}: PatientSelectorProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return patients.slice(0, 50)
    return patients
      .filter((p) => p.patient_id.toString().includes(query.trim()))
      .slice(0, 50)
  }, [query, patients])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium flex items-center gap-2" style={{ color: "#C4A35A" }}>
        <User className="h-4 w-4" />
        Select Patient
      </label>
      <input
        type="text"
        placeholder="Search patient ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(196,163,90,0.3)",
          color: "white",
        }}
      />
      <div className="flex flex-col max-h-56 overflow-y-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-sm text-blue-300">No patients found</p>
        ) : (
          filtered.map((patient) => (
            <button
              key={patient.patient_id}
              onClick={() => onSelectPatient(patient.patient_id)}
              className="text-left px-3 py-2 text-sm transition-colors"
              style={
                selectedPatientId === patient.patient_id
                  ? { background: "#9E7E38", color: "white", fontWeight: 600 }
                  : { color: "#cbd5e1" }
              }
              onMouseEnter={(e) => {
                if (selectedPatientId !== patient.patient_id)
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)"
              }}
              onMouseLeave={(e) => {
                if (selectedPatientId !== patient.patient_id)
                  (e.target as HTMLElement).style.background = "transparent"
              }}
            >
              Patient {patient.patient_id}
            </button>
          ))
        )}
      </div>
      {!query && (
        <p className="text-xs" style={{ color: "rgba(196,163,90,0.7)" }}>Showing first 50 — search to filter</p>
      )}
    </div>
  )
}
