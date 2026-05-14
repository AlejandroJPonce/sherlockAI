export type AuditRecord = {
  id: string
  policy: string
  nombreTitular: string
  documento: string
  fechaVisita: string
  ciudad: string
  telefono: string
  plan: string
  rawData: Record<string, string>
  audioFile: File | null
  audioStatus: 'pending' | 'attached' | 'processing'
  similarityScore: number | null
  transcription: string | null
  reasoning?: string | null
  approvalStatus: approvals
  actions?: string 
}

export type AuditSession = {
  id: string
  fileName: string
  createdAt: number
  auditor: string
  records: AuditRecord[]
  status: 'in_progress' | 'completed'
  summary: {
    total: number    
    approved: number 
    rejected: number 
    review: number   
    pending: number  
  }
}

export type approvals = 'pending' | 'approved' | 'rejected' | 'review'