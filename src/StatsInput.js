import React from 'react';
import {Button, Row} from "react-bootstrap";


function StatsInput({players, onAddStats}) {

    const addStats = (playerName, action, pointValue) => {
        onAddStats(playerName, action, pointValue);
    }


    return (
        <>

            <Row>
                <div className={"table-responsive tableFixHead"}>
                    <table className="table table-striped ">
                        <thead>
                        <tr className={"text-center"}>
                            <th>Jugador</th>
                            <th style={{minWidth: "150px"}}>Recepción</th>
                            <th style={{minWidth: "150px"}}>Ataque</th>
                            <th style={{minWidth: "150px"}}>Contraataque</th>
                            <th style={{minWidth: "100px"}}>Bloqueo</th>
                            <th style={{minWidth: "150px"}}>Saque</th>
                            <th style={{minWidth: "100px"}}>Error por regla</th>
                        </tr>
                        </thead>
                        <tbody className={"text-center align-middle"}>
                        {players
                            .slice()
                            .filter((player) => player.isInCourt)
                            .sort((a, b) => a.position.localeCompare(b.position))
                            .map((player, index) => (
                                <tr
                                    key={index}
                                    className="table-row"
                                >
                                    <td>{player.name}</td>
                                    <td>
                                        <div className={"btn-group-vertical btn-column mx-1"}>
                                            <button className="mx-1 mb-1 btn btn-info mb-1 "
                                                    style={{fontSize: "0.6em", maxWidth: "66px"}}
                                                    onClick={() => addStats(player.name, 'recepcion', "recepcion_++")}
                                            >
                                                <span>++</span>
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'recepcion', "recepcion_+")}
                                                className="mx-1 mb-1 btn btn-success  "
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                <span>+</span>
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'recepcion', "recepcion_-")}
                                                className="mx-1 mb-1 btn btn-warning "
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}
                                            >
                                                <span>-</span>
                                            </button>

                                        </div>
                                        <div className={"btn-group-vertical btn-column"}>
                                            <button
                                                onClick={() => addStats(player.name, 'recepcion', "recepcion_saque_ganado")}
                                                className="mx-1 mb-1 btn btn-danger "

                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                S. ganado
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'recepcion', "recepcion_ace")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                Ace
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"btn-group-vertical btn-column mx-1"}>

                                            <button
                                                onClick={() => addStats(player.name, 'ataque', "ataque_++")}
                                                className="mx-1 mb-1 btn btn-info "
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                ++
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'ataque', "ataque_+")}
                                                className="mx-1 mb-1 btn btn-success"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'ataque', "ataque_-")}
                                                className="mx-1 mb-1 btn btn-warning"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}
                                            >
                                                -
                                            </button>
                                        </div>

                                        <div className={"btn-group-vertical btn-column"}>
                                            <button
                                                onClick={() => addStats(player.name, 'ataque', "ataque_error_de_bloqueo")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}
                                            >
                                                err/bloq
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'ataque', "ataque_error")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                error
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"btn-group-vertical  btn-column mx-1"}>

                                            <button
                                                onClick={() => addStats(player.name, 'contra-ataque', "contraataque_++")}
                                                className="mx-1 mb-1 btn btn-info"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                ++
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'contra-ataque', "contraataque_+")}
                                                className="mx-1 mb-1 btn btn-success"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'contra-ataque', "contraataque_-")}
                                                className="mx-1 mb-1 btn btn-warning"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                -
                                            </button>
                                        </div>
                                        <div className={"btn-group-vertical  btn-column "}>

                                            <button
                                                onClick={() => addStats(player.name, 'contra-ataque', "contraataque_error_de_bloqueo")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                err/bloq
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'contra-ataque', "contraataque_error")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                error
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"btn-group-vertical"}>

                                            <button
                                                onClick={() => addStats(player.name, 'bloqueo', "bloqueo_+")}
                                                className="mx-1 mb-1 btn btn-info"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                ++
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'bloqueo', "bloqueo_def")}
                                                className="mx-1 mb-1 btn btn-success"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                def
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'bloqueo', "bloqueo_-")}
                                                className="mx-1 mb-1 btn btn-warning"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"btn-group-vertical btn-column mx-1"}>

                                            <button
                                                onClick={() => addStats(player.name, 'saque', "saque_ace")}
                                                className="mx-1 mb-1 btn btn-info"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                ace
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'saque', "saque_+")}
                                                className="mx-1 mb-1 btn btn-success"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => addStats(player.name, 'saque', "saque_-")}
                                                className="mx-1 mb-1 btn btn-warning"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                -
                                            </button>

                                        </div>
                                        <div className={"btn-group-vertical btn-column"}>
                                            <button
                                                onClick={() => addStats(player.name, 'saque', "saque_error")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                error
                                            </button>

                                        </div>

                                    </td>
                                    <td>
                                        <div className={"btn-group-vertical"}>

                                            <button
                                                onClick={() => addStats(player.name, 'error_por_regla', "error_por_regla_error")}
                                                className="mx-1 mb-1 btn btn-danger"
                                                style={{fontSize: "0.7em", maxWidth: "66px"}}

                                            >
                                                error
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Row>
        </>
    )
        ;
}

export default StatsInput;
