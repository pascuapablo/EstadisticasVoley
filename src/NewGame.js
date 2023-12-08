import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {clean} from "gh-pages";


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
            <Modal show={show} onHide={handleCancel} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo partido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm={2}>
                                Mariano Moreno vs.
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control type="text" placeholder="Nombre" value={gameName}
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
