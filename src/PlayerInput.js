import React, {useState} from 'react';
import {Button, Form, Modal, Row} from "react-bootstrap";

function PlayerInput({onAddPlayer}) {
    const [playerName, setPlayerName] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit=(e) => {
        console.log(e)

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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="Nombre"  />
                        </Form.Group>
                        <Form.Select className={"mb-3"} >
                            <option >Armador</option>
                            <option >Punta</option>
                            <option >Central</option>
                            <option >Opuesto</option>
                            <option >Libero</option>

                        </Form.Select>
                        <Form.Group className="mb-3">
                            <Form.Control type="number" placeholder="Camiseta" />
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
