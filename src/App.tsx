import { useEffect, useState } from "react";
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
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [showTransModal, setShowTransModal] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(
    null,
  );

  const summary = {
    total: records.length,
    approved: records.filter((r) => r.approvalStatus === "approved").length,
    rejected: records.filter((r) => r.approvalStatus === "rejected").length,
    review: records.filter((r) => r.approvalStatus === "review").length,
    pending: records.filter(
      (r) => r.approvalStatus === "pending" && !r.audioFile,
    ).length,
  };

  const handleAudioUpload = (id: string, file: File) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, audioFile: file, audioStatus: "attached" }
          : record,
      ),
    );
  };

  const handleValidate = async (id: string) => {
    const record = records.find((r) => r.id === id);
    if (!record || !record.audioFile) return;

    setVerifyingId(id);

    // cambiamos el estado de processing
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
      setVerifyingId(null);
    }
  };

  const showTranscriptionModal = (record: AuditRecord) => {
    if (!record) return;

    setSelectedRecord(record);
    setShowTransModal(true);
  };

  const handleChangeStatus = (id: string, status: approvals) => {
    if (!status || !id) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, approvalStatus: status } : r,
      ),
    );

    setShowTransModal(false)
  };

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
          <Topbar />

          <div className="flex-1 flex flex-col overflow-auto p-5 mb-5">
            {!records.length && <UploadZone setRecords={setRecords} />}

            <StatsRow summary={summary} />

            <div className="flex-1 min-h-0">
              <RecordsTable
                records={records}
                onAudioUpload={(id, file) => handleAudioUpload(id, file)}
                onValidate={(id) => handleValidate(id)}
                verifyingId={verifyingId}
                handleShowTranscription={(e) => showTranscriptionModal(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
