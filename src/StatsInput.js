import React, { useState, useEffect, useRef } from 'react';
import './css/court.css';

// Posiciones absolutas de los 6 slots en la cancha (px)
// Layout visual: [pos4, pos3, pos2] / [pos5, pos6, pos1]
const SLOT_POS = [
    { top: 12,  left: 18  },  // slot 0 → pos4 (frente-izq)
    { top: 12,  left: 120 },  // slot 1 → pos3 (frente-centro)
    { top: 12,  left: 222 },  // slot 2 → pos2 (frente-der)
    { top: 118, left: 18  },  // slot 3 → pos5 (fondo-izq)
    { top: 118, left: 120 },  // slot 4 → pos6 (fondo-centro)
    { top: 118, left: 222 },  // slot 5 → pos1 (fondo-der = sacador)
];
// players[rotIdx] → slot index
// players[0]=pos1→slot5, [1]=pos2→slot2, [2]=pos3→slot1, [3]=pos4→slot0, [4]=pos5→slot3, [5]=pos6→slot4
const ROTATION_TO_SLOT = [5, 2, 1, 0, 3, 4];

// `action` = nombre canónico que espera StatsResults para el cálculo
const TABS_CONFIG = {
    recepcion:    { label: 'Recepción',     modo: 'recibiendo', action: 'recepcion'       },
    ataque:       { label: 'Ataque',        modo: 'recibiendo', action: 'ataque'          },
    bloqueo:      { label: 'Bloqueo',       modo: 'ambos',      action: 'bloqueo'         },
    contraataque: { label: 'Contraataque',  modo: 'ambos',      action: 'contra-ataque'   },
    saque:        { label: 'Saque',         modo: 'sacando',    action: 'saque'           },
    error:        { label: 'Error x regla', modo: 'ambos',      action: 'error_por_regla' },
};

const ACTIONS = {
    recepcion: [
        { label: '++',            key: 'recepcion_++',           cls: 'btn-verde'   },
        { label: '+',             key: 'recepcion_+',            cls: 'btn-azul'    },
        { label: '-',             key: 'recepcion_-',            cls: 'btn-naranja' },
        { label: 'Saque ganador', key: 'recepcion_saque_ganado', cls: 'btn-rojo'    },
        { label: 'Ace',           key: 'recepcion_ace',          cls: 'btn-rojo'    },
    ],
    saque: [
        { label: 'Ace',   key: 'saque_ace',   cls: 'btn-verde'   },
        { label: '+',     key: 'saque_+',     cls: 'btn-azul'    },
        { label: '-',     key: 'saque_-',     cls: 'btn-naranja' },
        { label: 'Error', key: 'saque_error', cls: 'btn-rojo'    },
    ],
    bloqueo: [
        { label: '++',  key: 'bloqueo_+',   cls: 'btn-verde'   },
        { label: 'def', key: 'bloqueo_def', cls: 'btn-azul'    },
        { label: '-',   key: 'bloqueo_-',   cls: 'btn-naranja' },
    ],
    ataque: [
        { label: '++',          key: 'ataque_++',               cls: 'btn-verde'   },
        { label: '+',           key: 'ataque_+',                cls: 'btn-azul'    },
        { label: '-',           key: 'ataque_-',                cls: 'btn-naranja' },
        { label: 'Err/bloqueo', key: 'ataque_error_de_bloqueo', cls: 'btn-rojo'    },
        { label: 'Error',       key: 'ataque_error',            cls: 'btn-rojo'    },
    ],
    contraataque: [
        { label: '++',          key: 'contraataque_++',               cls: 'btn-verde'   },
        { label: '+',           key: 'contraataque_+',                cls: 'btn-azul'    },
        { label: '-',           key: 'contraataque_-',                cls: 'btn-naranja' },
        { label: 'Err/bloqueo', key: 'contraataque_error_de_bloqueo', cls: 'btn-rojo'    },
        { label: 'Error',       key: 'contraataque_error',            cls: 'btn-rojo'    },
    ],
    error: [
        { label: 'Error x regla', key: 'error_por_regla_error', cls: 'btn-rojo' },
    ],
};

// Misma lógica de score action que el componente original
const POINT_TO_LOCAL = ['ataque_++', 'contraataque_++', 'bloqueo_+', 'saque_ace'];
const POINT_TO_VISIT = [
    'recepcion_saque_ganado', 'recepcion_ace',
    'ataque_error_de_bloqueo', 'ataque_error',
    'contraataque_error_de_bloqueo', 'contraataque_error',
    'bloqueo_-', 'saque_error', 'error_por_regla_error',
];

function StatsInput({ players, onAddStats, modo, rotationOrder, libero }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [activeTab, setActiveTab]           = useState(null);
    const mounted = useRef(false);

    // Si el tab activo no aplica al nuevo modo, volver a la selección de tabs
    useEffect(() => {
        if (activeTab) {
            const cfg = TABS_CONFIG[activeTab];
            if (cfg.modo !== 'ambos' && cfg.modo !== modo) {
                setActiveTab(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modo]);

    useEffect(() => { mounted.current = true; }, []);

    // Objetos de los jugadores que rotan, en orden de rotación
    const rotating = rotationOrder
        .map(name => players.find(p => p.name === name))
        .filter(Boolean);

    const liberoObj = libero ? players.find(p => p.name === libero) : null;

    // El líbero cubre al central en zona zaguera (posiciones 5 y 6 = rotIdx 4 y 5),
    // y también en posición 1 (rotIdx 0) cuando el equipo está recibiendo.
    // Cuando el central está en posición 1 sacando, no lo cubre (el líbero no puede sacar).
    let liberoCoversRotIdx = -1;
    if (liberoObj) {
        const checkIndices = modo === 'recibiendo' ? [0, 4, 5] : [4, 5];
        for (const ri of checkIndices) {
            if (rotating[ri] && rotating[ri].position === 'Central') {
                liberoCoversRotIdx = ri;
                break;
            }
        }
    }
    const liberoActive = liberoCoversRotIdx !== -1;
    const liberoSlot   = liberoActive ? ROTATION_TO_SLOT[liberoCoversRotIdx] : ROTATION_TO_SLOT[5];

    const server = rotationOrder[0]; // el sacador es siempre el primero en la rotación
    // Zagueros: posiciones 1, 5 y 6 (rotIdx 0, 4, 5) + el líbero
    const backRowPlayers = [rotationOrder[0], rotationOrder[4], rotationOrder[5]].filter(Boolean);
    const isBackRow = (name) => name === libero || backRowPlayers.includes(name);

    const cardTransition = !mounted.current
        ? 'none'
        : 'top 0.45s cubic-bezier(.4,0,.2,1), left 0.45s cubic-bezier(.4,0,.2,1), opacity 0.35s, transform 0.35s, background 0.15s, border-color 0.15s, box-shadow 0.15s';

    // Tabs disponibles según el modo Y el jugador seleccionado
    const availableTabs = Object.entries(TABS_CONFIG)
        .filter(([key, cfg]) => {
            if (cfg.modo !== 'ambos' && cfg.modo !== modo) return false;
            // Saque solo aparece si el jugador seleccionado es el sacador
            if (key === 'saque' && selectedPlayer !== server) return false;
            // Bloqueo solo para delanteros (posiciones 2, 3, 4)
            if (key === 'bloqueo' && isBackRow(selectedPlayer)) return false;
            return true;
        })
        .map(([key, cfg]) => ({ key, label: cfg.label }));

    const handleSelect = (playerName) => {
        setSelectedPlayer(prev => prev === playerName ? null : playerName);
        setActiveTab(null); // siempre volver a tabs al cambiar de jugador
    };

    const handleAction = (a) => {
        if (!selectedPlayer) return;
        let scoreAction = 'NOTHING';
        if (POINT_TO_LOCAL.includes(a.key)) scoreAction = 'ADD_TO_LOCAL';
        if (POINT_TO_VISIT.includes(a.key)) scoreAction = 'ADD_TO_VISIT';
        const label = `${TABS_CONFIG[activeTab].label} ${a.label}`;
        onAddStats(selectedPlayer, TABS_CONFIG[activeTab].action, a.key, scoreAction, label);
        // tras computar la stat: deseleccionar y volver a la pantalla inicial
        setSelectedPlayer(null);
        setActiveTab(null);
    };

    const renderCardContent = (player) => (
        <>
            {player.photo
                ? <img className="player-photo" src={player.photo} alt={player.name}
                       onError={(e) => { e.target.style.display = 'none'; }} />
                : <div className="player-avatar-placeholder">{player.name[0]}</div>}
            <div className="player-label">
                <span className="player-name">{player.name} ({player.number})</span>
                <span className="player-position">{player.position}</span>
            </div>
        </>
    );

    return (
        <div className="court-page">

            {/* ── CANCHA ── */}
            <div className="cancha-wrapper">
                <div className="cancha">
                    {rotating.map((player, rotIdx) => {
                        const slotIdx    = ROTATION_TO_SLOT[rotIdx];
                        const pos        = SLOT_POS[slotIdx];
                        const covered    = rotIdx === liberoCoversRotIdx; // tapado por el líbero
                        const isSelected = selectedPlayer === player.name;
                        return (
                            <div
                                key={player.name}
                                className={`player-card${isSelected ? ' selected' : ''}${covered ? ' covered' : ''}`}
                                style={{ top: pos.top, left: pos.left, transition: cardTransition }}
                                onClick={() => { if (!covered) handleSelect(player.name); }}
                            >
                                {renderCardContent(player)}
                            </div>
                        );
                    })}

                    {liberoObj && (
                        <div
                            key="libero"
                            className={`player-card libero-card${selectedPlayer === libero ? ' selected' : ''}${liberoActive ? '' : ' libero-out'}`}
                            style={{
                                top: SLOT_POS[liberoSlot].top,
                                left: SLOT_POS[liberoSlot].left,
                                transition: cardTransition,
                            }}
                            onClick={() => { if (liberoActive) handleSelect(libero); }}
                        >
                            {renderCardContent(liberoObj)}
                        </div>
                    )}
                </div>
            </div>

            {/* ── PANEL DE STATS ── */}
            <div className="stats-panel">
                {!selectedPlayer ? (
                    <div className="empty-state">
                        <i className="bi bi-hand-index-thumb"></i>
                        <span>Tocá un jugador para registrar una acción</span>
                    </div>
                ) : (
                    <>
                        <div className="stats-header">
                            Registrando para <strong>{selectedPlayer}</strong>
                        </div>
                        {activeTab === null ? (
                            <div className="tabs-grid">
                                {availableTabs.map(t => (
                                    <button
                                        key={t.key}
                                        className="tab-btn"
                                        onClick={() => setActiveTab(t.key)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <div className="actions-header">
                                    <button className="btn-back" onClick={() => setActiveTab(null)}>
                                        ← volver
                                    </button>
                                    <span className="tab-active-label">
                                        {TABS_CONFIG[activeTab].label}
                                    </span>
                                </div>
                                <div className="actions-grid">
                                    {ACTIONS[activeTab].map(a => (
                                        <button
                                            key={a.key}
                                            className={`action-btn ${a.cls}`}
                                            onClick={() => handleAction(a)}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

export default StatsInput;
