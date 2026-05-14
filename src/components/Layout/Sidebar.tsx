import { useState } from "react";
import "../../styles/sidebar.css";

export const Sidebar = () => {
  const [selected, setSelected] = useState("new");

  const navItems = [
    { id: "new", label: "Nueva auditoría" },
    { id: "his", label: "Historial" },
  ];

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
              <path
                d="M12 3L20 18H4L12 3Z"
                stroke="#5DCAA5"
                strokeWidth="2"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <span className="logo-text">AuditAI</span>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${selected === item.id ? "active" : ""}`}
              onClick={() => setSelected(item.id)}
            >
              <div className="nav-dot"></div>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          Natalia Gonzalez <br />
          <span style={{ color: "#4e6180" }}>Admin</span>
        </div>
      </div>
    </>
  );
};
