import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/court.css';

// Posiciones absolutas de los 6 slots (igual que la cancha del juego)
const SLOT_POS = [
    { top: 12,  left: 18  },  // slot 0 → pos4 (frente-izq)
    { top: 12,  left: 120 },  // slot 1 → pos3 (frente-centro)
    { top: 12,  left: 222 },  // slot 2 → pos2 (frente-der)
    { top: 118, left: 18  },  // slot 3 → pos5 (fondo-izq)
    { top: 118, left: 120 },  // slot 4 → pos6 (fondo-centro)
    { top: 118, left: 222 },  // slot 5 → pos1 (fondo-der = saque)
];
// Número de posición de voley que representa cada slot visual
const SLOT_TO_POSITION = [4, 3, 2, 5, 6, 1];

function FormationBuilder({ players, onSetFormation }) {
    const navigate = useNavigate();

    // lineup[posIdx] (posIdx 0..5 = posición 1..6) = nombre del jugador o null
    const [lineup, setLineup] = useState(Array(6).fill(null));
    const [libero, setLibero] = useState(null);
    // slot seleccionado: 0..5 (posición), 'libero', o null
    const [selected, setSelected] = useState(null);

    const placedNames = new Set([...lineup.filter(Boolean), libero].filter(Boolean));
    const available = players.filter(p => !placedNames.has(p.name));

    const assignPlayer = (name) => {
        if (selected === null) return;
        if (selected === 'libero') {
            setLibero(name);
        } else {
            setLineup(prev => prev.map((n, i) => (i === selected ? name : n)));
        }
        setSelected(null);
    };

    const clearSlot = (slot) => {
        if (slot === 'libero') setLibero(null);
        else setLineup(prev => prev.map((n, i) => (i === slot ? null : n)));
        setSelected(null);
    };

    const handleSlotClick = (slot) => {
        const occupant = slot === 'libero' ? libero : lineup[slot];
        if (occupant) {
            clearSlot(slot); // tocar un slot lleno lo vacía
        } else {
            setSelected(prev => (prev === slot ? null : slot));
        }
    };

    const lineupComplete = lineup.every(Boolean);

    const handleSave = () => {
        if (!lineupComplete) return;
        // lineup está indexado por slot visual; rotationOrder por posición 1..6.
        const rotation = Array(6).fill(null);
        lineup.forEach((name, slot) => {
            const posIdx = SLOT_TO_POSITION[slot] - 1; // posición 1..6 → índice 0..5
            rotation[posIdx] = name;
        });
        onSetFormation(rotation, libero);
        navigate('/');
    };

    const playerByName = (name) => players.find(p => p.name === name);
    const courtAvatar = (p) => p.photo
        ? <img className="player-photo" src={p.photo} alt={p.name} />
        : <div className="player-avatar-placeholder">{p.name[0]}</div>;
    const chipAvatar = (p) => p.photo
        ? <img className="sub-card-avatar" src={p.photo} alt={p.name} />
        : <span className="sub-card-avatar">{p.name[0]}</span>;

    return (
        <div className="court-page">
            <div className="cancha-wrapper">
                <div className="cancha-titulo">
                    {selected !== null
                        ? 'Elegí un jugador del plantel'
                        : 'Tocá una posición para asignar'}
                </div>

                {/* CANCHA con slots de posición */}
                <div className="cancha">
                    {SLOT_POS.map((pos, slot) => {
                        const posNum   = SLOT_TO_POSITION[slot];
                        const occupant = lineup[slot];
                        const player   = occupant ? playerByName(occupant) : null;
                        const isSel    = selected === slot;
                        return (
                            <div
                                key={slot}
                                className={`player-card formation-slot${occupant ? '' : ' empty'}${isSel ? ' selecting' : ''}`}
                                style={{ top: pos.top, left: pos.left }}
                                onClick={() => handleSlotClick(slot)}
                            >
                                <span className="formation-posnum">{posNum}</span>
                                {player ? (
                                    <>
                                        {courtAvatar(player)}
                                        <div className="player-label">
                                            <span className="player-name">{player.name} ({player.number})</span>
                                            <span className="player-position">{player.position}</span>
                                        </div>
                                    </>
                                ) : (
                                    <span className="formation-plus">+</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* SLOT LÍBERO */}
                <div className="formation-libero-row">
                    <div
                        className={`player-card libero-card formation-slot${libero ? '' : ' empty'}${selected === 'libero' ? ' selecting' : ''}`}
                        style={{ position: 'static' }}
                        onClick={() => handleSlotClick('libero')}
                    >
                        {libero ? (
                            <>
                                {courtAvatar(playerByName(libero))}
                                <div className="player-label">
                                    <span className="player-name">{playerByName(libero).name} ({playerByName(libero).number})</span>
                                    <span className="player-position">Líbero</span>
                                </div>
                            </>
                        ) : (
                            <span className="formation-plus">+ Líbero</span>
                        )}
                    </div>
                </div>
            </div>

            {/* PLANTEL DISPONIBLE */}
            <div className="stats-panel">
                <div className="stats-header">
                    {available.length === 0 ? 'Todos asignados' : 'Plantel'}
                </div>
                <div className="sub-card-grid">
                    {available.map(p => (
                        <button
                            key={p.name}
                            className={`sub-card${selected !== null ? ' assignable' : ''}`}
                            disabled={selected === null}
                            onClick={() => assignPlayer(p.name)}
                        >
                            {chipAvatar(p)}
                            <span className="sub-card-name">{p.name} ({p.number})</span>
                            <span className="sub-card-pos">{p.position}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="btn-save-formation"
                    disabled={!lineupComplete}
                    onClick={handleSave}
                >
                    {lineupComplete ? 'Guardar y jugar' : `Faltan ${lineup.filter(n => !n).length} posiciones`}
                </button>
            </div>
        </div>
    );
}

export default FormationBuilder;
