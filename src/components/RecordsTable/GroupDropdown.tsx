import { useState } from "react";

export const GroupDropdown = () => {
  const options = [
    { value: "Asistencias", label: "Voy - Asistencias" },
    { value: "Exequial", label: "Olivos - Excequial" },
  ];

  const [selected, setSelected] = useState(options[0]);

  return (
    <>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="audit-btn audit-btn-sm audit-btn-secondary flex items-center gap-1"
        >
          {selected.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content dropdown-panel z-10 menu p-1 rounded-lg w-48 mt-1"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`audit-btn text-xs px-3 py-2 rounded-md w-full text-left ${
                  selected.value === option.value
                    ? "dropdown-item-active"
                    : "dropdown-item"
                }`}
                onClick={() => setSelected(option)}
              >
                {option.value === selected.value && "✓ "}
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
