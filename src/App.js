import React, {useEffect, useState} from 'react';
import PlayerList from "./pages/PlayerList";
import StatsResults from "./pages/StatsResults";
import {HashRouter, Route, Routes} from "react-router-dom";
import ComputeStatistics from "./pages/ComputeStatistics";
import MyNav from "./pages/Nav";
import NewGame from "./NewGame";

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
        return localStorage.getItem("gameName") || "Pueblo Nuevo"

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

    function handleOnNewGame(oppositeTeam) {
        console.log("gameName", oppositeTeam)
        setGameName(oppositeTeam)
        setStats([])
    }


    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("stats", JSON.stringify(stats));
        localStorage.setItem("gameName", gameName);
    }, [players, stats, gameName]);


    return (
        <>
            <HashRouter>
                <MyNav></MyNav>
                <Routes>
                    <Route path="/" element={<ComputeStatistics gameName={gameName} players={players}
                                                                addStats={addStats}></ComputeStatistics>}></Route>
                    <Route path="/resultados"
                           element={<StatsResults stats={stats} players={players} gameName={gameName}></StatsResults>}/>
                    <Route path="/cambios"
                           element={<PlayerList players={players} onAddPlayer={addPlayer} onDeletePlayer={deletePlayer}
                                                onEditPlayer={editPlayer}></PlayerList>}/>
                    <Route path="/newgame"
                           element={<NewGame onNewGame={handleOnNewGame}></NewGame>}/>
                    <Route path="/test"
                           element={<ComputeStatistics gameName={gameName} players={players}
                                                       addStats={addStats}></ComputeStatistics>}/>
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;