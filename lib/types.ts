export interface Patient {
  patient_id: number
  hadm_id: number
  risks: {
    dvt: number
    pressure_injury: number
  }
  vitals: {
    hr: number
    map: number
    spo2: number
    rr: number
  }
  alerts: string[]
}
