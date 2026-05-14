import { useRef } from "react";
import { audioValidationType } from "../../utils/audit.utils";
import type { AuditRecord } from "../../types/audit.types";

// componente separado para la celda de audio
export const AudioCell = ({
  record,
  onAudioUpload,
}: {
  record: AuditRecord;
  onAudioUpload: (id: string, file: File) => void;
}) => {
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
        {record.audioStatus == "attached" || record.audioStatus == "processing"   ? (
          <>
            <div className="flex items-center justify-between gap-6 bg-[#E1F5EE] py-[2px] px-4 rounded-full text-xs text-[#085041] text-center border border-[#5DCAA5]">
              {record.audioStatus === "attached" ? "✓ Adjunto" : record.audioStatus === "processing" ? 'Procesando...' : ''}
            </div>
          </>
        ) : (
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#f8fafc", color: "#94a3b8", border: "1px solid #dce3ee" }}
            onClick={() => inputRef.current?.click()}
          >
            + Adjuntar audio
          </button>
        )}
      </div>
    </>
  );
};
