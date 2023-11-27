import React, {useState} from 'react';
import {Button, Dropdown, Form, Row} from "react-bootstrap";
import CustomToggle from "./CustomToggle";

function PlayerList({players, onEditPlayer, onDeletePlayer}) {
    const [playerBeingEdited, setPlayerBeingEdited] = useState("");
    const [playerName, setPlayerName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
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

    function exitEdit() {
        setPlayerBeingEdited("")
        setPlayerName("");
        setPlayerNumber("");
        setPlayerPosition("")
    }

    const handleSave = (index) => {
        const player = players[index]
        onEditPlayer(index, {
            name: playerName,
            number: playerNumber,
            position: playerPosition,
            isInCourt: player.isInCourt
        })
        exitEdit()
    };
    const handleCancel = () => {
        setPlayerBeingEdited(null);
    };

    const handleAdd = () => {


        setPlayerBeingEdited("Pablo");
    };

    return (<table className="table table-lg tablePlayerList">
        <thead>
        <tr>
            <th className={"col-1"}>#</th>
            <th className={"col-3"}>Jugador</th>
            <th className={"col-3"}>Posición</th>
            <th className={"col-3 text-center"}>En Cancha</th>
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
                        <Form.Select  value={playerPosition}
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
                            checked={player.isInCancha}
                            onChange={(e) => {
                                onToggleInCancha(index, e.target.checked);
                            }}
                            className={"form-check-input"}
                        />
                    </td>
                    <td>
                        {playerBeingEdited !== player.name ?
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle}>
                                </Dropdown.Toggle>
                                <Dropdown.Menu size="sm" title="asdas">
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
                            <div className={"d-flex"}>
                                <Button onClick={() => {
                                    handleSave(index)
                                }} variant="" className={"text-success"}><i className="bi bi-check-circle-fill"></i>
                                </Button>
                                <Button variant="" className={"text-danger"} onClick={() => {
                                    exitEdit()
                                }}><i className="bi bi-x-circle-fill"></i>
                                </Button>
                            </div>

                        }
                    </td>

                </tr>
            )
        )}
        </tbody>
    </table>)
        ;
}

export default PlayerList;
