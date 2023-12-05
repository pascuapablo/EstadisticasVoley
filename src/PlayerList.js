import React, {useState} from 'react';
import {Button, Dropdown, Form} from "react-bootstrap";
import CustomToggle from "./CustomToggle";
import PlayerInput from "./PlayerInput";

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
        setPlayerPosition(player.position)
    };
    const onToggleInCancha = (index, status) => {
        onEditPlayer(index, {
            name: players[index].name,
            position: players[index].position,
            number: players[index].number,
            isInCourt: status
        })
    }


    const handleSave = (index) => {
        const player = players[index]
        onEditPlayer(index, {
            name: playerName,
            number: playerNumber,
            position: playerPosition,
            isInCourt: player.isInCourt
        })
        cleanState()
    };

    const handleAddPlayer = (name, position, number) => {
        onAddPlayer({
            name: name,
            position: position,
            number: number,
            isInCourt: false
        })
        cleanState()

    }

    function cleanState() {
        setPlayerBeingEdited("")
        setPlayerName("");
        setPlayerNumber("");
        setPlayerPosition("")
        setShowModal(false)
    }


    return (<table className="table table-lg tablePlayerList">
        <thead>
        <tr>
            <th className={"col-2"}>#</th>
            <th className={"col-3"}>Jugador</th>
            <th className={"col-3"}>Posición</th>
            <th className={"col-2 text-center"}>En cancha</th>
            <th className={"col-2"}></th>
        </tr>
        </thead>
        <tbody>

        {players.map((player, index) => (<tr key={index}>

                    <td>
                        {playerBeingEdited !== player.name ? player.number :
                            <Form.Control type="number" placeholder="" value={playerNumber}
                                          onChange={e => setPlayerNumber(e.target.value)}/>}</td>
                    <td>{playerBeingEdited !== player.name ? player.name :
                        <Form.Control type="text" placeholder="" value={playerName}
                                      onChange={e => setPlayerName(e.target.value)}/>} </td>
                    <td>{playerBeingEdited !== player.name ? player.position :
                        <Form.Select value={playerPosition}
                                     onChange={e => setPlayerPosition(e.target.value)}>
                            <option value="" disabled style={{display: 'none'}}>
                                Posición
                            </option>
                            <option value={"Armador"}>Armador</option>
                            <option value={"Punta"}>Punta</option>
                            <option value={"Central"}>Central</option>
                            <option value={"Opuesto"}>Opuesto</option>
                            <option value={"Libero"}>Libero</option>

                        </Form.Select>}
                    </td>

                    <td className={"text-center"}>
                        <input
                            type="checkbox"
                            checked={player.isInCourt}
                            onChange={(e) => {
                                onToggleInCancha(index, e.target.checked);
                            }}
                            className={"form-check-input"}
                        />
                    </td>
                    <td className={"text-center"}>
                        {playerBeingEdited !== player.name ?
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle}>
                                </Dropdown.Toggle>
                                <Dropdown.Menu size="sm">
                                    <Dropdown.Item>
                                        <Button variant="" className={"text-secondary"} onClick={() => {
                                            handleEdit(index)
                                        }}>Editar
                                        </Button>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Button variant="" className={"text-secondary"} onClick={() => {
                                            onDeletePlayer(index)
                                        }}>Borrar
                                        </Button>
                                    </Dropdown.Item>


                                </Dropdown.Menu>
                            </Dropdown>
                            :
                            <div className={"d-flex justify-content-around"}>
                                <Button onClick={() => {
                                    handleSave(index)
                                }} variant="" className={"text-success"}><i className="bi bi-check-circle-fill"></i>
                                </Button>
                                <Button variant="" className={"text-danger"} onClick={() => {
                                    cleanState()
                                }}><i className="bi bi-x-circle-fill"></i>
                                </Button>
                            </div>

                        }
                    </td>

                </tr>
            )
        )}

        <tr>
            <td className={"fst-italic text-secondary"}>#</td>
            <td className={"fst-italic text-secondary"}>Nombre</td>
            <td className={"fst-italic text-secondary"}>Posición</td>
            <td></td>
            <td className={"d-flex justify-content-around"}>
                <Button variant="" onClick={() => {
                    setShowModal(true)
                }}>
                    <i className="bi bi-person-fill-add text-primary fs-5"></i>
                </Button>
                <PlayerInput show={showModal} onAddPlayer={handleAddPlayer} onCancel={() => {
                    setShowModal(false)
                }}
                ></PlayerInput>
            </td>
        </tr>
        </tbody>
    </table>);
}

export default PlayerList;
