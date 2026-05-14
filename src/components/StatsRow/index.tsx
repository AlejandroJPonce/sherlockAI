type SummaryT = {
  total: number;
  approved: number;
  rejected: number;
  review: number;
  pending: number;
};

export const StatsRow = ({ summary }: { summary: SummaryT }) => {
  return (
    <>
      <div className="w-full flex items-center justify-center gap-5">
        <div className="flex flex-col items-start justify-center gap-2 text-gray-300 w-[100%] min-w-[200px] p-5 rounded-lg bg-white border border-[#e2e8f0]">
          <div className="text-xl text-[#94a3b8]">TOTAL REGISTROS</div>
          {summary.total ? (
            <div className="text-4xl text-[#1a2540]">{summary.total}</div>
          ) : (
            <div className="font-bold">------</div>
          )}
          <div className="text-md text-[#94a3b8]">del documento</div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 text-gray-300 w-[100%] min-w-[200px] p-5 rounded-lg bg-white border border-[#e2e8f0]">
          <div className="text-xl text-[#94a3b8]">APROBADOS</div>
          {summary.total ? (
            <div className="text-4xl text-[#0F6E56]">{summary.approved}</div>
          ) : (
            <div className="font-bold">------</div>
          )}
          <div className="text-md text-[#94a3b8]">validados por IA</div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 text-gray-300 w-[100%] min-w-[200px] p-5 rounded-lg bg-white border border-[#e2e8f0]">
          <div className="text-xl text-[#94a3b8]">RECHAZADOS</div>
          {summary.total ? (
            <div className="text-4xl text-[#A32D2D]">{summary.rejected}</div>
          ) : (
            <div className="font-bold">------</div>
          )}
          <div className="text-md text-[#94a3b8]">baja similitud</div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 text-gray-300 w-[100%] min-w-[200px] p-5 rounded-lg bg-white border border-[#e2e8f0]">
          <div className="text-xl text-[#94a3b8]">PENDIENTES</div>
          {summary.total ? (
            <div className="text-4xl text-[#854F0B]">{summary.pending}</div>
          ) : (
            <div className="font-bold">------</div>
          )}
          <div className="text-md text-[#94a3b8]">sin audio</div>
        </div>
      </div>
    </>
  );
};
