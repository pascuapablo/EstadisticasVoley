import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

function NewGame({onNewGame}) {
    const [gameName, setGameName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        onNewGame(gameName);
        setGameName("");
        navigate('/');
    };

    return (
        <div className="newgame-page">
            <h2 className="newgame-title">Nuevo partido</h2>

            <div className="newgame-card">
                <label className="newgame-label">Rival</label>
                <div className="newgame-vs">
                    <span className="newgame-home">Mariano Moreno</span>
                    <span className="newgame-x">vs</span>
                </div>
                <Form.Control
                    className="newgame-input"
                    type="text"
                    placeholder="Nombre del rival"
                    value={gameName}
                    onChange={e => setGameName(e.target.value)}
                />
                <button className="newgame-go" onClick={handleSubmit}>
                    <i className="bi bi-play-fill"></i> A jugar
                </button>
            </div>

            <p className="newgame-note">
                <i className="bi bi-exclamation-triangle"></i>
                <span>
                    Si empezás un partido nuevo, las estadísticas actuales se borran.{" "}
                    <button className="newgame-link" onClick={() => navigate('/resultados')}>Descargalas</button> antes si no las querés perder.
                </span>
            </p>
        </div>
    );
}

export default NewGame;
