import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import type { AuditRecord } from "../../types/audit.types";
import { WaitingTable } from "./WaitingData";
import { AudioCell } from "./AudioCell";
import { VerifyCell } from "./VerifyCell";
import { useState, useMemo, useEffect } from "react";
import { GroupDropdown } from "./GroupDropdown";

/** Clases Tailwind por `column.id` para ocultar celdas en viewport estrechos (mobile-first). */
const COLUMN_VISIBILITY: Partial<Record<string, string>> = {
  documento: "hidden sm:table-cell",
  ciudad: "hidden md:table-cell",
};

function cellResponsiveClass(columnId: string): string {
  return COLUMN_VISIBILITY[columnId] ?? "";
}

export const RecordsTable = ({
  records,
  verifyingIds,
  loading,
  onAudioUpload,
  onValidate,
  onValidateAll,
  handleShowTranscription,
}: {
  records: AuditRecord[];
  verifyingIds: Set<string>;
  loading?: number;
  onAudioUpload: (id: string, file: File) => void;
  onValidate: (id: string) => void;
  onValidateAll: () => void;
  handleShowTranscription: (record: AuditRecord) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [Vall, setVall] = useState(true)

  const columnHelper = createColumnHelper<AuditRecord>();

  const columns = useMemo(() => [
    columnHelper.accessor("policy", {
      header: () => <div className="flex justify-center w-full">Póliza</div>,

      enableSorting: true,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="text-[#1a2540] text-center w-[4.5rem] max-w-[5.5rem] sm:w-[100px] sm:max-w-[100px] line-clamp-1">{record.policy}</div>
        );
      },
    }),
    columnHelper.accessor("nombreTitular", {
      header: "Titular",
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="text-[#1a2540] min-w-[90px] max-w-[140px] sm:min-w-[100px] sm:max-w-[220px] line-clamp-1">
            {record.nombreTitular}
          </div>
        );
      },
    }),
    columnHelper.accessor("documento", {
      header: "N° Documento",
      enableSorting: true,
      cell: ({ row }) => {
        const record = row.original;

        return <div className="text-[#94a3b8]">{record.documento}</div>;
      },
    }),
    columnHelper.accessor("ciudad", {
      header: "Ciudad",
      enableSorting: true,
      cell: ({ row }) => {
        const record = row.original;

        return <div className="text-[#94a3b8] uppercase w-[150px] max-w-[150px] line-clamp-1">{record.ciudad}</div>;
      },
    }),
    columnHelper.accessor("audioStatus", {
      header: () => <div className="flex justify-center w-full">Audio</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="flex justify-center w-full">
            <AudioCell
              record={record}
              onAudioUpload={(id, file) => onAudioUpload(id, file)}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("actions", {
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;
        const isLoading = verifyingIds.has(record.id);

        return (
          <>
            <VerifyCell
              record={record}
              loading={isLoading}
              handleValidate={(id: string) => onValidate(id)}
            />
          </>
        );
      },
    }),
    columnHelper.accessor("similarityScore", {
      header: "Similitud",
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <>
            {!record.similarityScore ? (
              <span className="text-[#cbd5e1]">---------</span>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3 w-full min-w-[5.5rem] sm:min-w-[100px]">
                <div className="w-full h-[10px] rounded-2xl bg-[#e8f2ff]">
                  <div
                    className={`h-full transition-all rounded-full ${record.similarityScore < 40
                      ? "bg-red-600"
                      : record.similarityScore > 40 &&
                        record.similarityScore < 90
                        ? "bg-orange-300"
                        : record.similarityScore >= 90
                          ? "bg-green-500"
                          : ""
                      }`}
                    style={{ width: `${record.similarityScore}%` }}
                  />
                </div>

                <div className="text-xs">{record.similarityScore}%</div>
                <div
                  className="hover:text-blue-700 hover:cursor-pointer"
                  onClick={() => handleShowTranscription(record)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </>
        );
      },
    }),
    columnHelper.accessor("approvalStatus", {
      header: "Estado",
      enableSorting: false,
      cell: ({ getValue }) => {
        const status = getValue();
        const styles = {
          pending: "bg-[#fef9ec] text-[#854F0B] border-[#f0c87a] border",
          approved: "bg-[#E1F5EE] text-[#085041] border-[#5DCAA5] border",
          rejected: "bg-[#FCEBEB] text-[#791F1F] border-[#F09595] border",
          review: "bg-[#eff6ff] text-[#1e4f8c] border-[#bcd4f0] border",
        } as const;

        const labels = {
          pending: "Pendiente",
          approved: "Aprobado",
          rejected: "Rechazado",
          review: "Revisar",
        } as const;

        return (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status as keyof typeof styles]}`}
          >
            {labels[status as keyof typeof labels]}
          </span>
        );
      },
    }),
  ], [onAudioUpload, onValidate, handleShowTranscription, verifyingIds]);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      return rec.nombreTitular.toLowerCase().includes(search.toLowerCase());
    });
  }, [records, search]);

  const table = useReactTable({
    data: filteredRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    records.some(e => e.audioFile ? setVall(false) : true)
  }, [records])

  return (
    <>
      {!records.length ? (
        <WaitingTable />
      ) : (
        <div className="h-full min-h-0 flex flex-col rounded-xl gap-2 sm:gap-0">
          {/* top-bar-table */}
          <div className="shrink-0 flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3 bg-transparent">
            <div className="flex min-w-0 rounded-base w-full sm:max-w-xs md:max-w-md">
              <span className="inline-flex items-center px-3 text-sm text-[#303644] bg-neutral-tertiary border rounded-e-0 border-default-medium border-e-0 rounded-s-base">
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                id="website-admin"
                className="rounded-none rounded-e-base block min-w-0 flex-1 px-2.5 py-2 sm:px-3 sm:py-2.5 bg-white border text-[#303644] text-sm rounded-base placeholder:text-[#999ba3]"
                placeholder="Buscar..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-stretch justify-end gap-2 w-full sm:w-auto sm:justify-center">
              <button
                disabled={Vall}
                type="button"
                className="flex flex-1 min-w-[10rem] sm:flex-initial items-center justify-center gap-1 audit-btn audit-btn-sm audit-btn-outline-success disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                onClick={onValidateAll}
              >
                <span className="truncate">Verificar todos</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`size-4 sm:size-5 shrink-0 ${loading && 'loading'}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </button>
              <button type="button" className="audit-btn audit-btn-sm audit-btn-success text-xs sm:text-sm whitespace-nowrap shrink-0">
                Exportar .xlsx
              </button>
              <GroupDropdown />
            </div>
          </div>

          {/* Tabla: scroll horizontal en viewports estrechos + columnas progresivas + Titular sticky */}
          <div className="min-h-0 min-w-0 flex flex-col rounded-lg sm:rounded-xl border border-[#e2e8f0] bg-white overflow-hidden">
            <div className="scrollbar-none min-h-0 min-w-0 overflow-x-auto overscroll-x-contain [touch-action:pan-x_y]">
              <table className="table table-auto min-w-max w-full border-collapse text-[0.8125rem] sm:text-sm bg-white text-left">
                <thead className="bg-[#f8fafc]" style={{ borderBottom: "#e2e8f0" }}>
                  <tr className="border-b border-gray-300">
                    <th className="text-[0.65rem] sm:text-xs text-[#94a3b8] uppercase py-2 px-2 sm:py-3 sm:px-3 md:px-4 text-center w-10 min-w-[2.5rem] max-w-[3rem] sm:w-[70px] sm:max-w-[70px] sm:min-w-[70px] sticky left-0 z-30 bg-[#f8fafc]">
                      ID
                    </th>
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header) => {
                        const isTitular = header.column.id === "nombreTitular";
                        const responsive = cellResponsiveClass(header.column.id);
                        return (
                          <th
                            key={header.id}
                            className={`text-[0.65rem] sm:text-xs text-[#94a3b8] uppercase py-2 px-2 sm:py-3 sm:px-3 md:px-4 ${responsive} ${header.column.id === "policy"
                                ? "whitespace-nowrap min-w-[4.5rem] sm:min-w-[100px] sticky left-[2.5rem] sm:left-[70px] z-[28] bg-[#f8fafc]"
                                : ""
                              } ${isTitular
                                ? "sticky left-[7.25rem] sm:left-[170px] md:left-[202px] z-20 min-w-[140px] sm:min-w-[220px] whitespace-nowrap bg-[#f8fafc]"
                                : ""
                              }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div
                              className={`flex items-center ${header.column.id === "similarityScore" ? "justify-center" : ""}`}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() &&
                                (header.column.getIsSorted() === "asc"
                                  ? " ↑"
                                  : header.column.getIsSorted() === "desc"
                                    ? " ↓"
                                    : " ↕")}
                            </div>
                          </th>
                        );
                      }),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group text-gray-700 border-b border-[#f1f5f9] hover:bg-[#f8fafc] font-light"
                    >
                      <td className="bg-[#f8fafc] border-r border-[#e2e8f0] py-2 px-2 sm:py-3 sm:px-3 md:px-4 text-[0.8125rem] sm:text-sm text-center whitespace-nowrap w-10 min-w-[2.5rem] sm:min-w-[70px] sticky left-0 z-30">
                        {parseInt(row.id) + 1}
                      </td>
                      {row.getVisibleCells().map((cell) => {
                        const isTitular = cell.column.id === "nombreTitular";
                        const responsive = cellResponsiveClass(cell.column.id);
                        return (
                          <td
                            key={cell.id}
                            className={`py-2 px-2 sm:py-3 sm:px-3 md:px-4 text-[0.8125rem] sm:text-sm align-top ${responsive} ${cell.column.id === "policy"
                                ? "sticky left-[2.5rem] sm:left-[70px] z-[28] bg-white group-hover:bg-[#f8fafc]"
                                : ""
                              } ${isTitular
                                ? "sticky left-[7.25rem] sm:left-[170px] md:left-[202px] z-20 min-w-[140px] sm:min-w-[220px] whitespace-nowrap bg-white"
                                : ""
                              }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="shrink-0 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 sm:px-4 sm:py-3 bg-[#f8fafc] border-t border-[#e2e8f0]">
              <span className="text-xs text-gray-400">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="audit-btn audit-btn-xs audit-btn-secondary"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className="audit-btn audit-btn-xs audit-btn-secondary"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
