import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import PlayerInput from "../PlayerInput";

const POSITIONS = ["Armador", "Punta", "Central", "Opuesto", "Libero"];

function PlayerList({players, onEditPlayer, onDeletePlayer, onAddPlayer}) {
    const [playerBeingEdited, setPlayerBeingEdited] = useState("");
    const [playerName, setPlayerName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleEdit = (index) => {
        const player = players[index];
        setPlayerBeingEdited(player.name);
        setPlayerName(player.name);
        setPlayerNumber(player.number);
        setPlayerPosition(player.position);
    };
    const handleSave = (index) => {
        const player = players[index];
        onEditPlayer(index, {
            ...player,
            name: playerName,
            number: playerNumber,
            position: playerPosition,
        });
        cleanState();
    };
    const handleAddPlayer = (name, position, number) => {
        onAddPlayer({name, position, number, isInCourt: false});
        cleanState();
    };
    function cleanState() {
        setPlayerBeingEdited("");
        setPlayerName("");
        setPlayerNumber("");
        setPlayerPosition("");
        setShowModal(false);
    }

    const avatar = (player) => player.photo
        ? <img className="roster-avatar" src={player.photo} alt={player.name}/>
        : <span className="roster-avatar ph">{(player.name || "?")[0]}</span>;

    return (
        <div className="roster-page">
            <h2 className="roster-title">Plantel</h2>

            <div className="roster-list">
                {players.map((player, index) => {
                    const editing = playerBeingEdited === player.name;
                    if (editing) {
                        return (
                            <div className="roster-card editing" key={index}>
                                <div className="roster-edit">
                                    <Form.Control className="re-num" type="number" placeholder="#"
                                                  value={playerNumber} onChange={e => setPlayerNumber(e.target.value)}/>
                                    <Form.Control className="re-name" type="text" placeholder="Nombre"
                                                  value={playerName} onChange={e => setPlayerName(e.target.value)}/>
                                    <Form.Select className="re-pos" value={playerPosition}
                                                 onChange={e => setPlayerPosition(e.target.value)}>
                                        <option value="" disabled>Posición</option>
                                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </Form.Select>
                                    <div className="roster-actions">
                                        <button className="roster-icon ok" onClick={() => handleSave(index)}>
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                        <button className="roster-icon" onClick={cleanState}>
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="roster-card" key={index}>
                            {avatar(player)}
                            <div className="roster-info">
                                <span className="roster-name">{player.name} <span className="num">#{player.number}</span></span>
                                <span className="roster-pos">{player.position}</span>
                            </div>
                            <div className="roster-actions">
                                <button className="roster-icon" onClick={() => handleEdit(index)} title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="roster-icon danger" onClick={() => onDeletePlayer(index)} title="Borrar">
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="roster-add" onClick={() => setShowModal(true)}>
                <i className="bi bi-person-plus-fill"></i> Agregar jugador
            </button>

            <PlayerInput show={showModal} onAddPlayer={handleAddPlayer} onCancel={() => setShowModal(false)}/>
        </div>
    );
}

export default PlayerList;
