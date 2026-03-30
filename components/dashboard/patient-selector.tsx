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
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <User className="h-4 w-4" />
        Select Patient
      </label>
      <input
        type="text"
        placeholder="Search patient ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-md border border-input bg-background">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">No patients found</p>
        ) : (
          filtered.map((patient) => (
            <button
              key={patient.patient_id}
              onClick={() => onSelectPatient(patient.patient_id)}
              className={`text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                selectedPatientId === patient.patient_id
                  ? "bg-primary text-primary-foreground hover:bg-primary"
                  : ""
              }`}
            >
              Patient {patient.patient_id}
            </button>
          ))
        )}
      </div>
      {!query && (
        <p className="text-xs text-muted-foreground">Showing first 50 — search to filter</p>
      )}
    </div>
  )
}
