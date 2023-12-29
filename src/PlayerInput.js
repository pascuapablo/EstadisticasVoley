import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {ARMADOR, CENTRAL, LIBERO, OPUESTO, PUNTA} from "./const/Positions";


function PlayerInput({onAddPlayer, onCancel, show}) {
    const [playerName, setPlayerName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');

    const cleanState = () => {
        setPlayerName("");
        setPlayerPosition("");
        setPlayerNumber("")
    }

    const handleSubmit = (e) => {
        console.log(e)
        console.log(playerNumber, playerName, playerPosition)
        onAddPlayer(playerName, playerPosition, playerNumber)

        cleanState()
    }

    const handleCancel = () => {

        onCancel()
        cleanState()
    }
    return (
        <>
            <Modal id="myModal" show={show} onHide={handleCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Nombre" value={playerName}
                                          onChange={e => setPlayerName(e.target.value)}/>
                        </Form.Group>
                        <Form.Select className={"mb-3 "} value={playerPosition} style={{color: "#212529"}}
                                     onChange={e => setPlayerPosition(e.target.value)}>
                            <option value="" disabled style={{display: 'none'}}>
                                Posición
                            </option>
                            <option value={ARMADOR}>Armador</option>
                            <option value={PUNTA}>Punta</option>
                            <option value={CENTRAL}>Central</option>
                            <option value={OPUESTO}>Opuesto</option>
                            <option value={LIBERO}>Libero</option>

                        </Form.Select>

                        <Form.Group className="mb-3">
                            <Form.Control type="number" placeholder="Camiseta" value={playerNumber}
                                          onChange={e => setPlayerNumber(e.target.value)}/>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        cerrar
                    </Button>
                    <Button variant="primary" className={"text-light"} onClick={handleSubmit}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
        ;
}

export default PlayerInput;
