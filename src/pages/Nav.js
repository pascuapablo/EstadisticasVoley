import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ITEMS = [
    { to: "/",           label: "Cancha",    icon: "bi-clipboard2-pulse", match: (p) => p === "/" || p === "" },
    { to: "/formacion",  label: "Formación", icon: "bi-diagram-3-fill",   match: (p) => p.includes("formacion") },
    { to: "/cambios",    label: "Plantel",   icon: "bi-people-fill",      match: (p) => p.includes("cambios") },
    { to: "/resultados", label: "Stats",     icon: "bi-bar-chart-fill",   match: (p) => p.includes("resultados") },
    { to: "/newgame",    label: "Nuevo",     icon: "bi-plus-circle-fill", match: (p) => p.includes("newgame") },
];

function MyNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname || "/";

    return (
        <nav className="bottom-nav">
            {ITEMS.map((it) => {
                const active = it.match(path);
                return (
                    <button
                        key={it.label}
                        className={active ? "active" : ""}
                        onClick={() => navigate(it.to)}
                    >
                        <span className="nav-ico"><i className={`bi ${it.icon}`}></i></span>
                        <span className="nav-lbl">{it.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

export default MyNav;
