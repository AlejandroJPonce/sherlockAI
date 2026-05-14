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

export const RecordsTable = ({
  records,
  onAudioUpload,
  onValidate,
  verifyingId,
  handleShowTranscription,
}: {
  records: AuditRecord[];
  onAudioUpload: (id: string, file: File) => void;
  onValidate: (id: string) => void;
  verifyingId: string | null;
  handleShowTranscription: (record: AuditRecord) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<AuditRecord>();

  const columns = [
    columnHelper.accessor("policy", {
      header: () => <div className="flex justify-center w-full">Póliza</div>,

      enableSorting: true,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="text-[#1a2540] text-center w-[100px] max-w-[100px] line-clamp-1">{record.policy}</div>
        );
      },
    }),
    columnHelper.accessor("nombreTitular", {
      header: "Titular",
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="text-[#1a2540] w-[220px] max-w-[220px] line-clamp-1">
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
        const isLoading = verifyingId === record.id;

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
              <div className="flex items-center gap-3 w-full min-w-[100px]">
                <div className="w-full h-[10px] rounded-2xl bg-[#e8f2ff]">
                  <div
                    className={`h-full transition-all rounded-full ${
                      record.similarityScore < 40
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
  ];

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

  return (
    <>
      {!records.length ? (
        <WaitingTable />
      ) : (
        <div className="h-full flex flex-col rounded-xl">
          {/* top-bar-table */}
          <div className="shrink-0 flex items-center justify-between py-3 bg-transparent">
            <div className="flex rounded-base">
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
                className="rounded-none rounded-e-base block w-full px-3 py-2.5 bg-white border text-[#303644] text-sm rounded-base placeholder:text-[#999ba3]"
                placeholder="Buscar..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              {/* <button className="btn btn-sm btn-cancel text-xs">
                Validar todos
              </button> */}
              <GroupDropdown />
              <button className="btn btn-active btn-export text-xs">
                Exportar .xlsx
              </button>
            </div>
          </div>

          {/* table */}
          <table
            className="table text-sm overflow-auto"
            style={{ background: "white", border: "1px solid #e2e8f0" }}
          >
            <thead style={{ background: "#f8fafc", borderBottom: "#e2e8f0" }}>
              <tr className="border-b border-gray-300">
                <th className="text-xs text-[#94a3b8] uppercase py-3 px-4 text-center w-[70px] max-w-[70px]">
                  ID
                </th>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-xs text-[#94a3b8] uppercase py-3 px-4"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={`flex items-center ${header.id === "similarityScore" ? "justify-center" : ""}`}
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
                  )),
                )}
              </tr>
            </thead>

            <tbody className="w-full">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="text-gray-700 border-b border-[#f1f5f9] hover:bg-[#f8fafc] font-light"
                >
                  <td className="bg-[#f8fafc] border-r border-[#e2e8f0] py-3 px-4 text-sm text-center">
                    {parseInt(row.id) + 1}
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination controllers */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0]">
            <span className="text-xs text-gray-400">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-xs btn-controller"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ← Anterior
              </button>
              <button
                className="btn btn-xs btn-controller"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
