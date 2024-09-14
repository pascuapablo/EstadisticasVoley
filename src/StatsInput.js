import {Row} from "react-bootstrap";
import {ARMADOR, CENTRAL, LIBERO, OPUESTO, PUNTA} from "./const/Positions";


function StatsInput({players, onAddStats}) {

    const addStats = (playerName, action, pointValue) => {
        const pointValueToLocalTeam = ["ataque_++", "contraataque_++", "bloqueo_+", "saque_ace"]
        const pointValueToVisitTeam = ["recepcion_saque_ganado", "recepcion_ace", "ataque_error_de_bloqueo",
            "ataque_error", "contraataque_error_de_bloqueo", "contraataque_error", "bloqueo_-", "saque_error",
            "error_por_regla_error"]

        var scoreAction = "NOTHING"
        if(pointValueToLocalTeam.includes(pointValue)) scoreAction="ADD_TO_LOCAL";
        if(pointValueToVisitTeam.includes(pointValue)) scoreAction="ADD_TO_VISIT";

        onAddStats(playerName, action, pointValue,scoreAction);
    }

    const sortingFunction = (a, b) => {

        const order = [LIBERO, PUNTA, OPUESTO, CENTRAL, ARMADOR]
        const aIndex = order.indexOf(a.position);
        const bIndex = order.indexOf(b.position);
        if (aIndex !== bIndex) {
            return aIndex - bIndex;
        }
        return a.name.localeCompare(b.name);

    }

    return (
        <>

            <Row>
                <div className={"table-responsive tableFixHead"}>
                    <table className="table table-striped ">
                        <thead>
                        <tr className={"text-center align-middle"}>
                            <th className={"col-1"}>Jugador</th>
                            <th style={{minWidth: "150px"}} className={"col-2"}>Recepción</th>
                            <th style={{minWidth: "100px"}} className={"col-1"}>Bloqueo</th>
                            <th style={{minWidth: "150px"}} className={"col-2"}>Saque</th>
                            <th style={{minWidth: "150px"}} className={"col-2"}>Contraataque</th>
                            <th style={{minWidth: "150px"}} className={"col-2"}>Ataque</th>
                            <th style={{minWidth: "100px"}} className={"col-1"}>Error por regla</th>
                        </tr>
                        </thead>
                        <tbody className={"text-center align-middle"}>
                        {players
                            .slice()
                            .filter((player) => player.isInCourt)
                            .sort(sortingFunction)
                            .map((player, index) => (
                                <tr
                                    key={index}
                                    className="table-row"
                                >
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            {player.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            <div className={"btn-group-vertical btn-column  col-5"}>
                                                <button className=" mb-1 btn btn-info mb-1 "
                                                        style={{fontSize: "0.6em"}}
                                                        onClick={() => addStats(player.name, 'recepcion', "recepcion_++")}
                                                >
                                                    <span>++</span>
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'recepcion', "recepcion_+")}
                                                    className=" mb-1 btn btn-success  "
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    <span>+</span>
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'recepcion', "recepcion_-")}
                                                    className=" mb-1 btn btn-warning "
                                                    style={{fontSize: "0.7em"}}
                                                >
                                                    <span>-</span>
                                                </button>

                                            </div>
                                            <div className={"btn-group-vertical btn-column col-5 col-5"}>
                                                <button
                                                    onClick={() => addStats(player.name, 'recepcion', "recepcion_saque_ganado")}
                                                    className=" mb-1 btn btn-danger "

                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    <div>Saque</div>
                                                    <div>ganador</div>
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'recepcion', "recepcion_ace")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}
                                                >
                                                    Ace
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            <div className={"btn-group-vertical btn-column col-5 "}>

                                                <button
                                                    onClick={() => addStats(player.name, 'saque', "saque_ace")}
                                                    className=" mb-1 btn btn-info"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    ace
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'saque', "saque_+")}
                                                    className=" mb-1 btn btn-success"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'saque', "saque_-")}
                                                    className=" mb-1 btn btn-warning"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    -
                                                </button>

                                            </div>
                                            <div className={"btn-group-vertical btn-column col-5"}>
                                                <button
                                                    onClick={() => addStats(player.name, 'saque', "saque_error")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    error
                                                </button>

                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            <div className={"btn-group-vertical col-12"}>

                                                <button
                                                    onClick={() => addStats(player.name, 'bloqueo', "bloqueo_+")}
                                                    className=" mb-1 btn btn-info"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    ++
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'bloqueo', "bloqueo_def")}
                                                    className=" mb-1 btn btn-success"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    def
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'bloqueo', "bloqueo_-")}
                                                    className=" mb-1 btn btn-warning"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    -
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            <div className={"btn-group-vertical  btn-column col-5 "}>

                                                <button
                                                    onClick={() => addStats(player.name, 'contra-ataque', "contraataque_++")}
                                                    className=" mb-1 btn btn-info"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    ++
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'contra-ataque', "contraataque_+")}
                                                    className=" mb-1 btn btn-success"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'contra-ataque', "contraataque_-")}
                                                    className=" mb-1 btn btn-warning"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    -
                                                </button>
                                            </div>
                                            <div className={"btn-group-vertical  btn-column col-5 "}>

                                                <button
                                                    onClick={() => addStats(player.name, 'contra-ataque', "contraataque_error_de_bloqueo")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    err/bloq
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'contra-ataque', "contraataque_error")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    error
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100 "}>
                                            <div className={"btn-group-vertical btn-column col-5 "}>

                                                <button
                                                    onClick={() => addStats(player.name, 'ataque', "ataque_++")}
                                                    className=" mb-1 btn btn-info "
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    ++
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'ataque', "ataque_+")}
                                                    className=" mb-1 btn btn-success"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'ataque', "ataque_-")}
                                                    className=" mb-1 btn btn-warning"
                                                    style={{fontSize: "0.7em"}}
                                                >
                                                    -
                                                </button>
                                            </div>

                                            <div className={"btn-group-vertical btn-column col-5"}>
                                                <button
                                                    onClick={() => addStats(player.name, 'ataque', "ataque_error_de_bloqueo")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}
                                                >
                                                    err/bloq
                                                </button>
                                                <button
                                                    onClick={() => addStats(player.name, 'ataque', "ataque_error")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    error
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"d-inline-flex justify-content-evenly w-100"}>
                                            <div className={"btn-group-vertical  col-12"}>

                                                <button
                                                    onClick={() => addStats(player.name, 'error_por_regla', "error_por_regla_error")}
                                                    className=" mb-1 btn btn-danger"
                                                    style={{fontSize: "0.7em"}}

                                                >
                                                    error
                                                </button>
                                            </div>
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
