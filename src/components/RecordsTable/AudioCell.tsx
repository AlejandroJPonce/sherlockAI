import React from "react";

import { useRef } from "react";
import { audioValidationType } from "../../utils/audit.utils";
import type { AuditRecord } from "../../types/audit.types";

// componente separado para la celda de audio
export const AudioCell = React.memo(({
  record,
  onAudioUpload,
  onDeleteAudioFile,
}: React.PropsWithChildren<{
  record: AuditRecord;
  onAudioUpload: (id: string, file: File) => void;
  onDeleteAudioFile: (id: string) => void
}>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!audioValidationType(file)) return;
    onAudioUpload(record.id, file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <div className="min-h-[40px] flex items-center justify-start gap-3">
        {record.audioStatus == "attached" || record.audioStatus == "processing" ? (
          <>
            <div className="flex items-center justify-between gap-6 bg-[#E1F5EE] py-[2px] px-4 rounded-full text-xs text-[#085041] text-center border border-[#5DCAA5]">
              {record.audioStatus === "attached" ? "✓ Adjunto" : record.audioStatus === "processing" ? 'Procesando...' : ''}
            </div>
            {
              record.audioStatus == "attached" ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-red-900 hover:text-red-700  hover:cursor-pointer" onClick={() => onDeleteAudioFile(record.id)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg> : ''
            }
          </>
        ) : (
          <button
            className="audit-btn audit-btn-sm audit-btn-secondary"
            style={{ backgroundColor: "#f8fafc", color: "#94a3b8", border: "1px solid #dce3ee" }}
            onClick={() => inputRef.current?.click()}
          >
            + Adjuntar audio
          </button>
        )}
      </div>
    </>
  );
});
