import { useCallback, useMemo, useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Layout/Sidebar";
import { Topbar } from "./components/Layout/Topbar";
import { UploadZone } from "./components/UploadZone";
import type { AuditRecord, approvals } from "./types/audit.types";
import { RecordsTable } from "./components/RecordsTable";
import { StatsRow } from "./components/StatsRow";
import { sendAudioForValidation } from "./utils/audit.utils";
import { TranscriptionViewer } from "./components/RecordsTable/TrasncriptionViewer";

function App() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(() => new Set());
  const [showTransModal, setShowTransModal] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null,);

  const summary = useMemo(() => ({
    total: records.length,
    approved: records.filter((r) => r.approvalStatus === "approved").length,
    rejected: records.filter((r) => r.approvalStatus === "rejected").length,
    review: records.filter((r) => r.approvalStatus === "review").length,
    pending: records.filter(
      (r) => r.approvalStatus === "pending" && !r.audioFile,
    ).length,
  }), [records]);

  const handleAudioUpload = (id: string, file: File) => {
    try {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? { ...record, audioFile: file, audioStatus: "attached" }
            : record,
        ),
      );
    } catch (error) {
      console.error("Error subiendo audio: ", error);
    }
  }

  const handleValidate = useCallback(async (id: string) => {
    const record = records.find((r) => r.id === id);
    if (!record?.audioFile) return;

    setVerifyingIds((prev) => {
      if (prev.has(id)) return prev;
      return new Set(prev).add(id);
    });

    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, audioStatus: "processing" } : r)),
    );

    try {
      const result = await sendAudioForValidation(record.audioFile, record);

      if (result) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                ...r,
                isVerified: true,
                audioStatus: "attached",
                similarityScore: result.score,
                transcription: result.transcription,
                approvalStatus: result.status,
                reasoning: result.reasoning,
              }
              : r,
          ),
        );
      }
    } catch (error) {
      console.error("Error validando: ", error);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, audioStatus: "attached" } : r)),
      );
    } finally {
      setVerifyingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [records]);

  const handleValidateAll = useCallback(() => {
    records.filter((e) => e.audioFile != null && !e.isVerified ? handleValidate(e.id) : '')
  }, [records])

  const handleDeleteAudioFile = useCallback((id: string) => {
    if (!id) return
    setRecords((prev) => 
      prev.map((r) => 
        r.id === id ? { ...r, audioFile: null, audioStatus: 'pending', similarityScore: 0, isVerified: false } : r,
      ),
    )
  }, [])

  const showTranscriptionModal = useCallback((record: AuditRecord) => {
    if (!record) return;

    setSelectedRecord(record);
    setShowTransModal(true);
  }, []);

  const handleChangeStatus = useCallback((id: string, status: approvals) => {
    if (!status || !id) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, approvalStatus: status } : r,
      ),
    );

    setShowTransModal(false)
  }, []);

  return (
    <>
      {selectedRecord && (
        <TranscriptionViewer
          show={showTransModal}
          isRecord={selectedRecord}
          handleClose={() => setShowTransModal(false)}
          changeStatus={(id, status) => handleChangeStatus(id, status)}
        />
      )}

      <div className="h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar activeGroup="Voy - Asistencias" />

          <div className="flex-1 flex flex-col overflow-x-hidden p-5 mb-5">
            {!records.length && <UploadZone setRecords={setRecords} />}

            <StatsRow summary={summary} />

            <div className="flex-1 min-h-0">
              <RecordsTable
                records={records}
                onAudioUpload={(id, file) => handleAudioUpload(id, file)}
                onValidate={(id) => handleValidate(id)}
                verifyingIds={verifyingIds}
                handleShowTranscription={(e) => showTranscriptionModal(e)}
                onValidateAll={handleValidateAll}
                deleteAudioFile={(id) => handleDeleteAudioFile(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
