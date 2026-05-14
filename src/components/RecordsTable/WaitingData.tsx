export const WaitingTable = () => {
  return (
    <>
      <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden mt-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-xs font-medium text-slate-400">
            Registros del documento
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Titular
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Nº documento
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Audio
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Similitud
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-14 px-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-slate-400">
              Sin registros aún
            </p>
            <p className="text-xs text-slate-300 text-center max-w-xs leading-relaxed">
              Sube un archivo Excel para cargar los registros y comenzar la
              auditoría
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
