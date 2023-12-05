import React, {useEffect, useState} from 'react';
import PlayerList from "./PlayerList";
import StatsInput from "./StatsInput";
import StatsResults from "./StatsResults";
import {Row, Tab, Tabs} from "react-bootstrap";
import PlayerInput from "./PlayerInput";

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



    const editPlayer = (oldPlayerIndex, newPlayer) => {
        players.splice(oldPlayerIndex, 1, newPlayer)
        setPlayers([...players]);
    }

    const addStats = (playerName, action, pointValue) => {
        console.log({playerName, action, pointValue})
        setStats([...stats, {playerName, action, pointValue}]);

    }

    const addPlayer = (player) =>{
        setPlayers([...players,player])
    }

    const deletePlayer = (index) => {
        players.splice(index, 1)
        setPlayers([...players]);
    }

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("stats", JSON.stringify(stats));
    }, [players, stats]);

    return (
        <div className="col m-3">
            <Tabs
                defaultActiveKey="tab1"
                id="uncontrolled-tab-example"
                className="mb-4 text-black"
            >
                <Tab eventKey="tab1" title="Jugadores ">
                    <Row>
                        <PlayerList players={players} onDeletePlayer={deletePlayer} onEditPlayer={editPlayer} onAddPlayer={addPlayer}/>
                    </Row>


                </Tab>
                <Tab eventKey="tab2" title="Estadisticas">
                    <StatsInput players={players} onAddStats={addStats}/>
                </Tab>
                <Tab eventKey="tab3" title="Resultados" className={"text-black"}>
                    <StatsResults stats={stats} players={players}></StatsResults> </Tab>

            </Tabs>

        </div>
    );
}

export default App;
