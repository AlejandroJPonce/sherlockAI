import type { AuditRecord } from "../../types/audit.types";

// componente separado para la celda de verificación
export const VerifyCell = ({
  record,
  handleValidate,
  loading
}: {
  record: AuditRecord;
  handleValidate: (e: string) => void;
  loading: boolean
}) => {
  return (
    <>
      <button
        disabled={record.audioStatus == "pending" || loading}
        className="btn btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#eff6ff",
          color: "#2563a8",
          border: "1px solid #e2e8f0",
        }}
        onClick={() => handleValidate(record.id)}
      >
        Verificar{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`size-5 ${loading && 'loading'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      </button>
    </>
  );
};
