import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";


function NewGame({onNewGame, onCancel, show}) {

    const [gameName, setGameName] = useState('');

    const cleanState = () => {
        setGameName("")
    }

    const handleSubmit = () => {

        onNewGame(gameName)
        cleanState()
    }


    const handleCancel = () => {
        onCancel()
        cleanState()
    }
    return (
        <>
            <Modal show={show} onHide={handleCancel} >
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo partido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm={5}>
                                Mariano Moreno vs.
                            </Form.Label>
                            <Col sm={7}>
                                <Form.Control type="text" placeholder="Equipo" value={gameName}
                                              onChange={e => setGameName(e.target.value)}/>
                            </Col>
                        </Form.Group>

                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cerrar
                    </Button>
                    <Button variant="primary" className={"text-light"} onClick={handleSubmit}>
                        A jugar!
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
        ;
}

export default NewGame ;