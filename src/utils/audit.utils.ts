import { DOC_TYPES, AUDIO_TYPES, MAX_DOC_SIZE, MAX_AUDIO_SIZE, APPROVED, REVIEW } from "../constants/audit.constants"
import type { AuditRecord } from "../types/audit.types"
import * as XLSX from "xlsx"
import axios from 'axios'

export const docValidationType = (file: File): boolean => {

  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
  const validType = DOC_TYPES.includes(extension)
  const validSize = file.size <= MAX_DOC_SIZE

  return validType && validSize

}

export const audioValidationType = (file: File): boolean => {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
  const validType = AUDIO_TYPES.includes(extension)
  const validSize = file.size <= MAX_AUDIO_SIZE
  return validType && validSize
}

export const idGen = (): string => {
  return crypto.randomUUID()
}

export const readDocument = (file: File): Promise<AuditRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsArrayBuffer(file)

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result
        const workbook = XLSX.read(buffer, { type: 'array' })

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet)
        const records: AuditRecord[] = rows.map((row) => ({
          id: idGen(),
          policy: row["POLIZA (Aplica para ventas Triple A)"] ?? "-----",
          nombreTitular: row["NOMBRE DEL TITULAR"] ?? "----------",
          documento: row["N° DE DOCUMENTO DE IDENTIDAD (Sin puntos ni comas)"] ?? "",
          fechaVisita: row["FECHA DE VISITA"] ?? "",
          ciudad: row["CIUDAD"] ?? "",
          telefono: row["TELÉFONO"] ?? "",
          plan: row["PLAN"] ?? "",
          rawData: row,
          audioFile: null,
          audioStatus: 'pending',
          similarityScore: null,
          transcription: null,
          approvalStatus: 'pending',
        }))

        resolve(records)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

export const getApprovalStatus = (score: number): AuditRecord['approvalStatus'] => {
  if (score >= APPROVED) return 'approved'
  if (score >= REVIEW) return 'review'
  return 'rejected'
}

export const sendAudioForValidation = async (audioFile: File, record: AuditRecord) => {
  const formData = new FormData()

  formData.append('audio', audioFile)
  formData.append('recordData', JSON.stringify(record))

  const { data } = await axios.post(
    'http://localhost:3001/api/audit/validate',
    formData
  )

  return data

}