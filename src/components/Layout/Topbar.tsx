import "../../styles/topbar.css"

export const Topbar = () => {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">Nueva auditoría</div>
        <div className="topbar-sub">Olivos Triple A · 09/05/2026</div>
      </div>
      <div className="topbar-right">
        <span className="badge badge-pending">En progreso</span>
        {/* <button className="btn-cancel hover:cursor-pointer">Cancelar</button> */}
        {/* <button className="flex items-center justify-center gap-3 btn-save hover:cursor-pointer">Guardar en BD <div className="w-[20px] h-[20px] loading bg-white"></div></button> */}
      </div>
    </div>
  )
}