import React, {useEffect, useState} from 'react';
import PlayerList from "./pages/PlayerList";
import StatsResults from "./pages/StatsResults";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ComputeStatistics from "./pages/ComputeStatistics";
import MyNav from "./pages/Nav";

function App() {
    const [players, setPlayers] = useState(() => {
        return JSON.parse(localStorage.getItem("players")) || [
            {name: 'Mario', position: 'Punta', isInCourt: true, number: 1},
            {name: 'Pablo', position: 'Central', isInCourt: true, number: 12},
            {name: 'Elias', position: 'Opuesto', isInCourt: true, number: 13},
            {name: 'Maxi', position: 'Libero', isInCourt: true, number: 41},
            {name: 'Santi', position: 'Central', isInCourt: true, number: 5},
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
        return JSON.parse(localStorage.getItem("gameName")) || "MM amarillo"
    });
    const [showNewGameModal, setShowNewGameModal] = useState(false);

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

    function startNewGame() {
        setShowNewGameModal(true)
    }

    function handleCancelNewGameModal() {
        setShowNewGameModal(false)
    }

    function handleOnNewGame(oppositeTeam) {
        setGameName(oppositeTeam)
        setShowNewGameModal(false)
    }



    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("stats", JSON.stringify(stats));
    }, [players, stats]);


    return (
        <>
            <MyNav></MyNav>

            <BrowserRouter>
                <Routes>
                    <Route path="/EstadisticasVoley" element={<ComputeStatistics gameName={gameName} players={players}
                                                                                 addStats={addStats}></ComputeStatistics>}></Route>
                    <Route path="/EstadisticasVoley/resultados"
                           element={<StatsResults stats={stats} players={players} gameName={gameName}></StatsResults>}/>
                    <Route path="/EstadisticasVoley/cambios"
                           element={<PlayerList players={players} onAddPlayer={addPlayer} onDeletePlayer={deletePlayer}
                                                onEditPlayer={editPlayer}></PlayerList>}/>
                    <Route path="/EstadisticasVoley/test"
                           element={<ComputeStatistics gameName={gameName} players={players}
                                                       addStats={addStats}></ComputeStatistics>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;