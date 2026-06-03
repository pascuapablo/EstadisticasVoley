import React, {useEffect, useState} from 'react';
import PlayerList from "./pages/PlayerList";
import StatsResults from "./pages/StatsResults";
import {HashRouter, Route, Routes} from "react-router-dom";
import ComputeStatistics from "./pages/ComputeStatistics";
import MyNav from "./pages/Nav";
import NewGame from "./NewGame";
import FormationBuilder from "./pages/FormationBuilder";

// Fotos disponibles (archivos en public/players). Bump la versión para invalidar caché.
const PHOTO_VERSION = 3;
const PHOTO_NAMES = new Set(['mario','pablo','fede','nico','eze','feli','maxi','seba','negro','lauro','juan','ale']);
const photoFor = (name) => {
    const key = (name || '').toLowerCase();
    return PHOTO_NAMES.has(key)
        ? `${process.env.PUBLIC_URL}/players/${key}.png?v=${PHOTO_VERSION}`
        : null;
};

const DEFAULT_ROSTER = [
    {name: 'Mario', position: 'Punta',   isInCourt: true,  number: 1},
    {name: 'Pablo', position: 'Central', isInCourt: true,  number: 2},
    {name: 'Fede',  position: 'Armador', isInCourt: true,  number: 3},
    {name: 'Nico',  position: 'Punta',   isInCourt: true,  number: 4},
    {name: 'Eze',   position: 'Central', isInCourt: true,  number: 5},
    {name: 'Feli',  position: 'Opuesto', isInCourt: true,  number: 6},
    {name: 'Maxi',  position: 'Libero',  isInCourt: true,  number: 7},
    {name: 'Seba',  position: 'Punta',   isInCourt: false, number: 8},
    {name: 'Negro', position: 'Armador', isInCourt: false, number: 9},
    {name: 'Lauro', position: 'Central', isInCourt: false, number: 10},
    {name: 'Juan',  position: 'Opuesto', isInCourt: false, number: 11},
    {name: 'Ale',   position: 'Central', isInCourt: false, number: 14},
];

function App() {

    const [players, setPlayers] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("players"));
        const base = saved || DEFAULT_ROSTER;
        // La foto SIEMPRE se recalcula a partir del nombre (ignora la guardada),
        // así un cambio de versión invalida la caché del navegador.
        return base.map(p => ({ ...p, photo: photoFor(p.name) }));
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

    const addStats = (playerName, action, pointValue,setNumber) => {
        console.log({playerName, action, pointValue})
        setStats([...stats, {playerName, action, pointValue, setNumber}]);

    }

    const undoLastStat = () => {
        setStats(prev => prev.slice(0, -1));
    }

    const addPlayer = (player) => {
        setPlayers([...players, player])
    }

    // Sustitución: el que sale deja la cancha, el que entra se suma.
    const substitutePlayer = (outName, inName) => {
        setPlayers(players.map(p => {
            if (p.name === outName) return {...p, isInCourt: false};
            if (p.name === inName)  return {...p, isInCourt: true};
            return p;
        }));
    }

    // Formación inicial: define titulares en cancha + orden de rotación + líbero.
    const setFormation = (rotation, liberoName) => {
        const inCourt = new Set([...rotation, liberoName].filter(Boolean));
        setPlayers(players.map(p => ({ ...p, isInCourt: inCourt.has(p.name) })));
        localStorage.setItem('rotationOrder', JSON.stringify(rotation));
    }

    const deletePlayer = (index) => {
        players.splice(index, 1)
        setPlayers([...players]);
    }

    function handleOnNewGame(oppositeTeam) {
        console.log("gameName", oppositeTeam)
        setGameName(oppositeTeam)
        setStats([])

        // MUY MUY MALA PRACTICA. HAY QUE USAR REDUX (?)
        localStorage.setItem("visitScore","0");
        localStorage.setItem("localScore", "0");
        localStorage.setItem("results", "[]");
    }


    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("stats", JSON.stringify(stats));
        localStorage.setItem("gameName", gameName.toString());
    }, [players, stats, gameName]);


    return (
        <>
            <HashRouter>
                <MyNav></MyNav>
                <Routes>
                    <Route path="/" element={<ComputeStatistics gameName={gameName} players={players}
                                                                addStats={addStats}
                                                                onUndoStat={undoLastStat}
                                                                onSubstitute={substitutePlayer}></ComputeStatistics>}></Route>
                    <Route path="/resultados"
                           element={<StatsResults stats={stats} players={players} gameName={gameName}></StatsResults>}/>
                    <Route path="/cambios"
                           element={<PlayerList players={players} onAddPlayer={addPlayer} onDeletePlayer={deletePlayer}
                                                onEditPlayer={editPlayer}></PlayerList>}/>
                    <Route path="/newgame"
                           element={<NewGame onNewGame={handleOnNewGame}></NewGame>}/>
                    <Route path="/formacion"
                           element={<FormationBuilder players={players} onSetFormation={setFormation}></FormationBuilder>}/>
                    <Route path="/test"
                           element={<ComputeStatistics gameName={gameName} players={players}
                                                       addStats={addStats}></ComputeStatistics>}/>
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;