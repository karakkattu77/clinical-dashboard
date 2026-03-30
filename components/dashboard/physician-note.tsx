"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Patient } from "@/lib/types"
import { ClipboardList } from "lucide-react"

interface PhysicianNoteProps {
  patient: Patient
}

function generateNote(patient: Patient): string {
  const { dvt, pressure_injury } = patient.risks
  const { hr, map, spo2, rr } = patient.vitals
  const lines: string[] = []

  // DVT/PE
  if (dvt >= 70) {
    lines.push(
      `Patient presents with HIGH DVT/PE risk (${dvt}%). Recommend initiating or reviewing prophylactic anticoagulation therapy. ` +
      `Evaluate for clinical signs of deep vein thrombosis or pulmonary embolism. Consider hematology consult if not already placed.`
    )
  } else if (dvt >= 30) {
    lines.push(
      `Patient has MODERATE DVT/PE risk (${dvt}%). Standard mechanical and pharmacologic prophylaxis should be confirmed and maintained. ` +
      `Continue monitoring for thrombotic signs.`
    )
  } else {
    lines.push(
      `DVT/PE risk is LOW (${dvt}%). Maintain standard precautions and continue ambulation protocols where appropriate.`
    )
  }

  // Pressure Injury
  if (pressure_injury >= 70) {
    lines.push(
      `Pressure injury risk is HIGH (${pressure_injury}%). Initiate full pressure ulcer prevention protocol: ` +
      `reposition every 2 hours, apply offloading mattress, and complete skin assessment each shift.`
    )
  } else if (pressure_injury >= 30) {
    lines.push(
      `Pressure injury risk is MODERATE (${pressure_injury}%). Ensure regular repositioning and skin monitoring are documented.`
    )
  } else {
    lines.push(`Pressure injury risk is LOW (${pressure_injury}%). Continue routine skin checks.`)
  }

  // Vitals commentary
  const vitalConcerns: string[] = []
  if (hr > 110) vitalConcerns.push(`tachycardia (HR ${hr} bpm)`)
  if (map < 65) vitalConcerns.push(`hypotension (MAP ${map} mmHg)`)
  if (spo2 < 92) vitalConcerns.push(`hypoxia (SpO2 ${spo2}%)`)
  if (rr > 24) vitalConcerns.push(`tachypnea (RR ${rr}/min)`)

  if (vitalConcerns.length > 0) {
    lines.push(
      `Current vitals indicate: ${vitalConcerns.join(", ")}. ` +
      `Urgent clinical review is recommended.`
    )
  } else {
    lines.push(`Vitals are within acceptable ranges at this time.`)
  }

  return lines.join("\n\n")
}

export function PhysicianNote({ patient }: PhysicianNoteProps) {
  const note = generateNote(patient)
  const isUrgent =
    patient.risks.dvt >= 70 ||
    patient.risks.pressure_injury >= 70 ||
    patient.alerts.some((a) =>
      ["tachycardia", "low oxygen", "low map", "hypotension"].some((k) =>
        a.toLowerCase().includes(k)
      )
    )

  return (
    <Card className={isUrgent ? "border-2 border-red-300 bg-red-50/30" : "border"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          Physician Note
          {isUrgent && (
            <span className="ml-2 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              Urgent Review
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {note.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60 mt-4 italic">
          Auto-generated based on model predictions and current vitals. Clinical judgment required.
        </p>
      </CardContent>
    </Card>
  )
}
