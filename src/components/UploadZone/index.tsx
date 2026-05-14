import { useRef } from "react";
import { docValidationType, readDocument } from "../../utils/audit.utils";
import type { AuditRecord } from "../../types/audit.types";

export const UploadZone = ({
  setRecords,
}: {
  setRecords: (records: AuditRecord[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!docValidationType(file)) return;

    const records = await readDocument(file);
    setRecords(records);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center text-gray-900">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />

        <div
          className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-blue-200 bg-white px-6 py-12 cursor-pointer transition-colors duration-150 hover:border-blue-600 hover:bg-blue-50 group mb-5"
          id="upload-zone"
          onClick={handleClick}
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 group-hover:bg-blue-100 transition-colors duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-slate-800">
              Subir documento Excel
            </p>
            <p className="text-xs text-slate-400">
              <span className="text-blue-600 font-medium">
                Haz clic para seleccionar
              </span>
              &nbsp;o arrastra el archivo aquí
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">
              .xlsx
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">
              .xls
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">
              máx. 10 MB
            </span>
          </div>

          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            id="file-input"
          />
        </div>
      </div>
    </>
  );
};
