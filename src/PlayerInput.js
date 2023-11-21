import React, {useState} from 'react';
import {Button, Form, Modal, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";

function Mo(props) {
    return null;
}

Mo.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    children: PropTypes.node
};

function PlayerInput({onAddPlayer}) {
    const [playerName, setPlayerName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        console.log(e)
        console.log(playerNumber, playerName, playerPosition)
        onAddPlayer(playerName, playerPosition,playerNumber)

        handleClose()
    }
    const addPlayer = () => {
        onAddPlayer(playerName, playerPosition);
        setPlayerName('');
        setPlayerPosition('');
    }


    return (
        <>
            <Row className={"justify-content-center"}>
                <Button className={"btn btn-primary col-sm-6 text-light"} onClick={handleShow}>Agregar Jugador</Button>
                {/*<Button className={"btn btn-primary col-sm-6"} onClick={addPlayer}>Agregar Jugador</Button>*/}
            </Row>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Nombre" value={playerName}
                                          onChange={e => setPlayerName(e.target.value)}/>
                        </Form.Group>
                        <Form.Select className={"mb-3"} value={playerPosition}
                                     onChange={e => setPlayerPosition(e.target.value)}>
                            <option>Armador</option>
                            <option>Punta</option>
                            <option>Central</option>
                            <option>Opuesto</option>
                            <option>Libero</option>

                        </Form.Select>
                        <Form.Group className="mb-3">
                            <Form.Control type="number" placeholder="Camiseta" value={playerNumber}
                                          onChange={e => setPlayerNumber(e.target.value)}/>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
        ;
}

export default PlayerInput;
