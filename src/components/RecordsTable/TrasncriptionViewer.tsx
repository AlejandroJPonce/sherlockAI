import type { approvals, AuditRecord } from "../../types/audit.types";

export const TranscriptionViewer = ({
  isRecord,
  show,
  handleClose,
  changeStatus
}: {
  isRecord: AuditRecord | null
  show: boolean;
  handleClose: () => void;
  changeStatus: (id:string, status: approvals) => void
}) => {
  if (!show || !isRecord) return null;

  return (
    <div className="fixed w-full h-full bg-black/30 z-50">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="w-[900px] min-h-[200px max-h-[800px] rounded-2xl h-auto bg-white absolute z-20 flex flex-col items-start justify-start shadow-2xl">
          {/* topbar modal */}
          <div
            className="w-full flex items-center justify-end relative p-5 rounded-t-2xl"
            style={{ background: "#1a2540", borderBottom: "#e2e8f0" }}
          >
            <div className="flex items-center justify-between cursor-pointer w-full">
              <div>
                <span>
                  Transcripción por la <span className="font-bold"> IA </span>{" "}
                  <div className="badge badge-pending ml-3">{isRecord.approvalStatus}</div>
                </span>
              </div>
              <div onClick={handleClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* transcription viewport */}
          <div className="flex flex-col w-full h-full p-10 gap-3 overflow-auto">
            <div className="py-2">
              <span className="text-justify text-base-100">
                {isRecord?.transcription}
              </span>
            </div>

            <div className="border w-full"></div>

            <div className="py-2 flex flex-col gap-4">
              <div>
                <span
                  className="rounded-r-full py-2 pl-3 pr-5 text-sm"
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bcd4f0",
                    color: "#2563a8",
                  }}
                >
                  Razonamiento del analisis
                </span>
              </div>
              <p className="text-justify text-base-100">{isRecord.reasoning}</p>
            </div>
          </div>

          {/* footer */}
          <div
            className="w-full flex items-center justify-between relative p-5 rounded-b-2xl"
            style={{ background: "#1a2540", borderBottom: "#e2e8f0" }}
          >
            {/* texto footer */}
            <div className="w-[50%]">
              El boton seleccionado mofdificara el estado del registro actual !
            </div>

            {/* botones */}
            <div className="flex items-center justify-end gap-2">
              {/* boton rechazar */}
              <button
                className="flex flex-1 min-w-[10rem] sm:flex-initial items-center justify-center gap-1 audit-btn audit-btn-sm cancel-btn-danger disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                onClick={() => changeStatus(isRecord.id, "rejected")}
              >
                Rechazar{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
              {/* boton aprobar */}
              <button
                className="audit-btn audit-btn-sm audit-btn-success flex inline-block gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0"
                onClick={() => changeStatus(isRecord.id, "approved")}
              >
                Aprobar{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`size-5`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
