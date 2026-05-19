import { useState } from "react"
import "../../styles/topbar.css"

export const Topbar = ({ activeGroup }: { activeGroup: string }) => {

  const [isEditable, setIsEditable] = useState(false)
  const [auditName, setAuditName] = useState<string>("")

  const handleSetName = (state: boolean) => {
    setIsEditable(state)
  }


  return (
    <div className="topbar">
      <div>
        {
          !isEditable ?
            <>
              <div className="flex items-center justify-start gap-2">
                <div>{auditName ? auditName : "Nueva auditoría"}</div>
                <svg onClick={() => handleSetName(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 hover:cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>

              </div>

            </> : <>
              <div className="flex items-center justify-start gap-2">
                <input
                  type="text"
                  id="website-admin"
                  className="rounded-none rounded-e-base block min-w-0 flex-1 py-1 px-1 bg-white border text-[#303644] text-sm rounded-base placeholder:text-[#999ba3]"
                  placeholder="Nombre de la auditoría"
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  onKeyDown={(e) => e.key == 'Enter' && handleSetName(false)}
                />
                <svg onClick={() => handleSetName(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 hover:cursor-pointer">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>

              </div>

            </>
        }


        <div className="topbar-sub">{activeGroup} · 09/05/2026</div>
      </div>
      <div className="topbar-right">
        <span className="badge badge-pending">En progreso</span>
        {/* <button className="btn-cancel hover:cursor-pointer">Cancelar</button> */}
        {/* <button className="flex items-center justify-center gap-3 btn-save hover:cursor-pointer">Guardar en BD <div className="w-[20px] h-[20px] loading bg-white"></div></button> */}
      </div>
    </div>
  )
}