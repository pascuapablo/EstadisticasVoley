import React, {useState} from 'react';
import { Col, Container, Form, Modal, Row} from "react-bootstrap";


function NewGame({onNewGame}) {

    const [gameName, setGameName] = useState('');

    const cleanState = () => {
        setGameName("")
    }

    const handleSubmit = () => {
        onNewGame(gameName)
        cleanState()
    }

    return (<>
            <h3 className={"my-2 text-center"}>Nuevo Partido</h3>
        <Container>
            <Row>
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
            </Row>

            <Row>
                <a href="/EstadisticasVoley/#" className={"btn btn-primary text-light ms-auto col-3 col-sm-2 mx-3 my-3"}
                   onClick={handleSubmit}>
                    A jugar!
                </a>
            </Row>

            <div className={" text-secondary"}>
                Si empezas un partido nuevo las estadísticas se borran.&nbsp;
                <a className={"link-secondary"} href="/EstadisticasVoley/#resultados">Descargalas</a>
                 &nbsp;si no las queres perder
            </div>
        </Container>
    </>);
}

export default NewGame;