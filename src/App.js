import React, {useEffect, useState} from 'react';
import PlayerList from "./PlayerList";
import StatsInput from "./StatsInput";
import StatsResults from "./StatsResults";
import {Row} from "react-bootstrap";
import NewGame from "./NewGame";

function App() {
    const [players, setPlayers] = useState(() => {
        return JSON.parse(localStorage.getItem("players")) || [
            {name: 'Mario', position: 'Punta', isInCourt: false, number: 1},
            {name: 'Pablo', position: 'Central', isInCourt: false, number: 12},
            {name: 'Elias', position: 'Opuesto', isInCourt: false, number: 13},
            {name: 'Maxi', position: 'Libero', isInCourt: false, number: 41},
            {name: 'Santi', position: 'Central', isInCourt: false, number: 5},
            {name: 'Lauro', position: 'Central', isInCourt: false, number: 6},
            {name: 'Fede', position: 'Armador', isInCourt: false, number: 7},
            {name: 'Negro', position: 'Armador', isInCourt: false, number: 8},
            {name: 'Facu', position: 'Punta', isInCourt: false, number: 9},
            {name: 'Sebas', position: 'Punta', isInCourt: false, number: 11},
        ]
    });

    const [stats, setStats] = useState(() => {
        return JSON.parse(localStorage.getItem("stats")) || []
    });
    const [gameName, setGameName] = useState(() => {
        return JSON.parse(localStorage.getItem("gameName")) || ""
    });

    const editPlayer = (oldPlayerIndex, newPlayer) => {
        players.splice(oldPlayerIndex, 1, newPlayer)
        setPlayers([...players]);
    }

    const addStats = (playerName, action, pointValue) => {
        console.log({playerName, action, pointValue})
        setStats([...stats, {playerName, action, pointValue}]);

    }

    const addPlayer = (player) => {
        setPlayers([...players, player])
    }

    const deletePlayer = (index) => {
        players.splice(index, 1)
        setPlayers([...players]);
    }

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("stats", JSON.stringify(stats));
    }, [players, stats]);

    function startNewGame() {

    }

    return (
        <div className="col m-3 ">
            <ul className="nav nav-tabs align-items-center" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="players-tab" data-bs-toggle="tab"
                            data-bs-target="#players-tab-pane" type="button" role="tab" aria-controls="players-tab-pane"
                            aria-selected="true">Jugadores
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="stats-input-tab" data-bs-toggle="tab"
                            data-bs-target="#stats-input-tab-pane" type="button" role="tab" aria-controls="stats-input-tab-pane"
                            aria-selected="false">Estadisticas
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="stats-results" data-bs-toggle="tab"
                            data-bs-target="#stats-results-pane" type="button" role="tab" aria-controls="stats-results-pane"
                            aria-selected="false">Resultados
                    </button>
                </li>
                <li className="ms-auto ">
                    <button className="btn btn-sm btn-primary text-light align-middle" onClick={() => (startNewGame())}>Empezar partido
                    </button>
                </li>
            </ul>

            <div className={"row my-4 text-center"}>
                <h5>
                    Mariano Moreno vs Estudiantes
                </h5>
            </div>

             <div className="tab-content " id="myTabContent">
                <div className="tab-pane fade show active" id="players-tab-pane" role="tabpanel" aria-labelledby="players-tab"
                     tabIndex="0">
                    <Row>
                        <PlayerList players={players} onDeletePlayer={deletePlayer} onEditPlayer={editPlayer}
                                    onAddPlayer={addPlayer}/>
                    </Row>
                </div>
                <div className="tab-pane fade" id="stats-input-tab-pane" role="tabpanel" aria-labelledby="stats-input-tab"
                     tabIndex="0">
                    <StatsInput players={players} onAddStats={addStats}/>

                </div>
                <div className="tab-pane fade" id="stats-results-pane" role="tabpanel" aria-labelledby="stats-results"
                     tabIndex="0">
                    <StatsResults stats={stats} players={players}></StatsResults>
                </div>
                <div className="tab-pane fade" id="stats-results-pane" role="tabpanel" aria-labelledby="stats-results"
                     tabIndex="0">
                    <StatsResults stats={stats} players={players}></StatsResults>
                </div>

            </div>

        </div>
    );
}

export default App;
