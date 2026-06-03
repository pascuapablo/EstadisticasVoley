import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import StatsInput from "../StatsInput";

function ComputeStatistics({ gameName, players, addStats, onUndoStat, onSubstitute }) {

    const [localScore, setLocalScore] = useState(() =>
        parseInt(localStorage.getItem("localScore")) || 0
    );
    const [visitScore, setVisitScore] = useState(() =>
        parseInt(localStorage.getItem("visitScore")) || 0
    );
    const [results, setResults] = useState(() =>
        JSON.parse(localStorage.getItem("results")) || []
    );
    const [showChangeSetModal, setShowChangeSetModal] = useState(false);
    const [showScoreInputs, setShowScoreInputs]       = useState(false);
    const [editLocal, setEditLocal]   = useState(0);
    const [editVisit, setEditVisit]   = useState(0);

    // ── Cambios de jugadores ──
    const [showSubModal, setShowSubModal] = useState(false);
    const [subOut, setSubOut] = useState('');
    const [subIn, setSubIn]   = useState('');

    // ── Historial para deshacer ──
    const [history, setHistory] = useState([]);
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => setToast(null), 5000);
    };

    // ── Modo (sacando/recibiendo) y rotación ──
    // rotationOrder = los 6 que rotan (sin el líbero); el líbero va aparte.
    const [modo, setModo] = useState('sacando');
    const [rotationOrder, setRotationOrder] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('rotationOrder') || 'null');
        if (saved && saved.length) return saved;
        return players.filter(p => p.isInCourt && p.position !== 'Libero').slice(0, 6).map(p => p.name);
    });

    useEffect(() => {
        localStorage.setItem('rotationOrder', JSON.stringify(rotationOrder));
    }, [rotationOrder]);

    // El líbero titular (en cancha). Se deriva de la plantilla.
    const liberoPlayer = players.find(p => p.isInCourt && p.position === 'Libero');
    const libero = liberoPlayer ? liberoPlayer.name : null;

    useEffect(() => {
        localStorage.setItem("visitScore", visitScore.toString());
        localStorage.setItem("localScore", localScore.toString());
        localStorage.setItem("results",    JSON.stringify(results));
    }, [localScore, visitScore, results]);

    const shouldChangeSet = (local, visit) => {
        const diff = Math.abs(local - visit) >= 2;
        return (local >= 25 || visit >= 25) && diff;
    };

    const changeScore = (local, visit) => {
        const newLocal = local ? localScore + local : localScore;
        const newVisit = visit ? visitScore + visit : visitScore;

        if (shouldChangeSet(newLocal, newVisit)) setShowChangeSetModal(true);
        if (local && newLocal >= 0) setLocalScore(newLocal);
        if (visit && newVisit >= 0) setVisitScore(newVisit);

        // Auto-switch modo y rotación
        if (local === 1) {
            // Local ganó el punto
            if (modo === 'recibiendo') {
                // Recupera el saque → rotamos y pasamos a sacando
                setRotationOrder(prev => [...prev.slice(1), prev[0]]);
                setModo('sacando');
            }
            // Si ya estaba sacando, no rota (mantuvo el saque)
        } else if (visit === 1) {
            // Visitante ganó el punto → pasamos a recibiendo
            setModo('recibiendo');
        }
    };

    // Guarda un snapshot del estado actual para poder deshacer.
    const snapshot = (registeredStat, desc) => {
        setHistory(h => [...h, {
            localScore, visitScore, results, modo, rotationOrder, registeredStat, desc
        }].slice(-60));
    };

    const handleAddStats = (playerName, action, pointValue, scoreAction, label) => {
        snapshot(true, `${playerName} · ${label}`); // estado previo + descripción
        const setNumber = results.length + 1;
        addStats(playerName, action, pointValue, setNumber);
        if (scoreAction === 'ADD_TO_LOCAL') changeScore(1, 0);
        if (scoreAction === 'ADD_TO_VISIT') changeScore(0, 1);
    };

    // +1 / -1 manual (también queda en el historial para deshacer)
    const handleManualScore = (local, visit) => {
        const team = (local !== 0) ? 'Mariano Moreno' : gameName;
        const sign = (local + visit) > 0 ? '+1' : '-1';
        snapshot(false, `${sign} ${team}`);
        changeScore(local, visit);
    };

    // Rotar manualmente la rotación (corrección durante el partido)
    const rotateManual = () => {
        snapshot(false, 'Rotación manual');
        setRotationOrder(prev => [...prev.slice(1), prev[0]]);
        showToast('🔄 Equipo rotado');
    };

    // Deshacer la última acción
    const handleUndo = () => {
        setHistory(h => {
            if (!h.length) return h;
            const last = h[h.length - 1];
            setLocalScore(last.localScore);
            setVisitScore(last.visitScore);
            setResults(last.results);
            setModo(last.modo);
            setRotationOrder(last.rotationOrder);
            if (last.registeredStat) onUndoStat();
            showToast(`↺ Deshecho: ${last.desc}`);
            return h.slice(0, -1);
        });
    };

    function startNewSet() {
        setResults([...results, { local: localScore, visit: visitScore }]);
        setLocalScore(0);
        setVisitScore(0);
        setShowChangeSetModal(false);
    }

    const handleSubstitute = () => {
        if (!subOut || !subIn) return;
        // El que entra toma el lugar de rotación del que sale
        setRotationOrder(prev => prev.map(n => (n === subOut ? subIn : n)));
        onSubstitute(subOut, subIn);
        setSubOut('');
        setSubIn('');
        setShowSubModal(false);
    };

    const courtPlayers = players.filter(p => p.isInCourt);
    const benchPlayers = players.filter(p => !p.isInCourt);

    const subAvatar = (p) => p.photo
        ? <img className="sub-card-avatar" src={p.photo} alt={p.name} />
        : <span className="sub-card-avatar">{p.name[0]}</span>;

    const setsLocal = results.filter(s => s.local > s.visit).length;
    const setsVisit = results.filter(s => s.local < s.visit).length;

    return (
        <div>
            {/* ── TOAST ── */}
            {toast && <div className="toast-msg">{toast}</div>}

            {/* ── MARCADOR ── */}
            <div className="scoreboard">
                <div className="team">
                    <div className="score-btns">
                        <button className="btn-score plus"  onClick={() => handleManualScore(1, 0)}>+1</button>
                        <button className="btn-score minus" onClick={() => handleManualScore(-1, 0)}>-1</button>
                    </div>
                    <span>Mariano Moreno</span>
                </div>

                <div className="score-num">
                    <span className="serve-ball">{modo === 'sacando' ? '🏐' : ''}</span>
                    {localScore}<sup>{setsLocal}</sup>
                </div>
                <div className="separator">|</div>
                <div className="score-num">
                    {visitScore}<sup>{setsVisit}</sup>
                    <span className="serve-ball">{modo === 'recibiendo' ? '🏐' : ''}</span>
                </div>

                <div className="team">
                    <span>{gameName}</span>
                    <div className="score-btns">
                        <button className="btn-score plus"  onClick={() => handleManualScore(0, 1)}>+1</button>
                        <button className="btn-score minus" onClick={() => handleManualScore(0, -1)}>-1</button>
                    </div>
                </div>
            </div>

            {/* ── BARRA DE ACCIONES ── */}
            <div className="subs-bar">
                <button className="btn-subs" onClick={handleUndo} disabled={history.length === 0}>
                    <i className="bi bi-arrow-counterclockwise"></i> Deshacer
                </button>
                <button className="btn-subs" onClick={rotateManual}>
                    <i className="bi bi-arrow-repeat"></i> Rotar
                </button>
                <button className="btn-subs" onClick={() => setShowSubModal(true)}>
                    <i className="bi bi-arrow-left-right"></i> Cambios
                </button>
            </div>

            {/* ── CANCHA + STATS ── */}
            <StatsInput
                players={players}
                onAddStats={handleAddStats}
                modo={modo}
                rotationOrder={rotationOrder}
                libero={libero}
            />

            {/* ── MODAL DE CAMBIOS ── */}
            <Modal show={showSubModal} onHide={() => setShowSubModal(false)} centered>
                <Modal.Header closeButton>
                    <strong className="me-auto">Cambio de jugador</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className="sub-section-title">
                        <i className="bi bi-box-arrow-left text-danger"></i> Sale
                    </div>
                    <div className="sub-card-grid">
                        {courtPlayers.map(p => (
                            <button
                                key={p.name}
                                className={`sub-card${subOut === p.name ? ' selected-out' : ''}`}
                                onClick={() => setSubOut(prev => prev === p.name ? '' : p.name)}
                            >
                                {subAvatar(p)}
                                <span className="sub-card-name">{p.name} ({p.number})</span>
                                <span className="sub-card-pos">{p.position}</span>
                            </button>
                        ))}
                    </div>

                    <div className="sub-section-title mt-3">
                        <i className="bi bi-box-arrow-in-right text-success"></i> Entra
                    </div>
                    <div className="sub-card-grid">
                        {benchPlayers.length === 0 && (
                            <div className="sub-empty">No hay suplentes en el banco</div>
                        )}
                        {benchPlayers.map(p => (
                            <button
                                key={p.name}
                                className={`sub-card${subIn === p.name ? ' selected-in' : ''}`}
                                onClick={() => setSubIn(prev => prev === p.name ? '' : p.name)}
                            >
                                {subAvatar(p)}
                                <span className="sub-card-name">{p.name} ({p.number})</span>
                                <span className="sub-card-pos">{p.position}</span>
                            </button>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowSubModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary text-light" disabled={!subOut || !subIn} onClick={handleSubstitute}>
                        Confirmar cambio
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── MODAL FIN DE SET ── */}
            <Modal show={showChangeSetModal} onHide={() => setShowChangeSetModal(false)}>
                <Modal.Header closeButton>
                    <strong className="me-auto">Fin de set!</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center d-flex justify-content-around">
                        <div><h5>{localScore}</h5><div>Mariano Moreno</div></div>
                        <div><h5>{visitScore}</h5><div>{gameName}</div></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => {
                        setShowScoreInputs(true);
                        setEditLocal(localScore);
                        setEditVisit(visitScore);
                    }}>
                        Corregir marcador
                    </Button>
                    <Button variant="primary text-light" onClick={startNewSet}>
                        Empezar otro set
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── MODAL CORREGIR MARCADOR ── */}
            <Modal show={showScoreInputs}>
                <Modal.Header>
                    <strong className="me-auto">Corregir marcador</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center d-flex justify-content-around">
                        <div>
                            <Form.Control
                                className="text-center mx-auto w-50" type="number"
                                value={editLocal}
                                onChange={e => setEditLocal(parseInt(e.target.value))}
                            />
                            <div>Mariano Moreno</div>
                        </div>
                        <div>
                            <Form.Control
                                className="text-center mx-auto w-50" type="number"
                                value={editVisit}
                                onChange={e => setEditVisit(parseInt(e.target.value))}
                            />
                            <div>{gameName}</div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => {
                        setShowScoreInputs(false);
                        setEditLocal(0); setEditVisit(0);
                    }}>
                        Cancelar
                    </Button>
                    <Button variant="primary text-light" onClick={() => {
                        setLocalScore(editLocal);
                        setVisitScore(editVisit);
                        setShowScoreInputs(false);
                        setEditLocal(0); setEditVisit(0);
                    }}>
                        Corregir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ComputeStatistics;
