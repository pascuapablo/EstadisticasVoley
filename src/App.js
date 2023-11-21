import React, {useState} from 'react';
import PlayerInput from "./PlayerInput";
import PlayerList from "./PlayerList";
import StatsInput from "./StatsInput";
import StatsResults from "./StatsResults";
import {Row, Tab, Tabs} from "react-bootstrap";

function App() {
    const [players, setPlayers] = useState([
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
    ]);

    const [stats, setStats] = useState([]);

    const addPlayer = (name, position, playerNumber) => {
        const newPlayer = {name, position, isInCancha: false, number: playerNumber};
        setPlayers([...players, newPlayer]);
    }

    const addStats = (playerName, action, pointValue) => {
        console.log({playerName, action, pointValue})
        setStats([...stats, {playerName, action, pointValue}]);

    }

    const toggleInCancha = (index, isInCourt) => {
        console.log(index, isInCourt)
        const updatedPlayers = [...players];
        updatedPlayers[index].isInCourt = isInCourt;
        setPlayers(updatedPlayers);
    }

    return (
        <div className="col m-3">
            <Tabs
                defaultActiveKey="tab1"
                id="uncontrolled-tab-example"
                className="mb-4 text-black"
            >
                <Tab eventKey="tab1" title="Jugadores ">
                    <Row>
                        <PlayerList players={players} onToggleInCancha={toggleInCancha}/>
                    </Row>
                    <Row>
                        <PlayerInput onAddPlayer={addPlayer}/>
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
