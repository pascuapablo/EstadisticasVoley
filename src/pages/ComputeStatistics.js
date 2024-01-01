import React, {useEffect, useState} from "react";
import {Button, Modal, Row, Toast} from "react-bootstrap";
import StatsInput from "../StatsInput";

function ComputeStatistics({gameName, players, addStats}) {
    const [showChangeSetModal, setShowChangeSetModal] = useState(false)

    const [localScore, setLocalScore] = useState(() => {
        return parseInt(localStorage.getItem("localScore")) || 0
    });
    const [visitScore, setVisitScore] = useState(() => {
        return parseInt(localStorage.getItem("visitScore")) || 0
    });

    const [results, setResults] = useState(() => {
        return JSON.parse(localStorage.getItem("results")) || []
    });

    useEffect(() => {
        localStorage.setItem("visitScore", visitScore.toString());
        localStorage.setItem("localScore", localScore.toString());
        localStorage.setItem("results", JSON.stringify(results));
    }, [localScore, visitScore,results]);

    const shouldChangeSet = (local, visit) => {
        const differenceIsMoreThanTwo = Math.abs(local - visit) >= 2
        return (local >= 25 || visit >= 25) && differenceIsMoreThanTwo
    }

    const changeScore = (local, visit) => {

        if (shouldChangeSet(localScore+local, visitScore + visit)){
            setShowChangeSetModal(true);
        }
        if (local) {
            setLocalScore(localScore + local)
        }
        if (visit) {
            setVisitScore(visitScore + visit)
        }

    }

    const handleAddStats = (playerName, action, pointValue, scoreAction) => {
        addStats(playerName, action, pointValue);
        if (scoreAction === "ADD_TO_LOCAL") changeScore(1, 0)
        if (scoreAction === "ADD_TO_VISIT") changeScore(0, 1)
    }


    function startNewSet() {
        setResults([...results, {local: localScore, visit: visitScore}])

        setLocalScore(0)
        setVisitScore(0)
        setShowChangeSetModal(false);
    }

    return (

        <div className="col m-3 ">
            <div className={"text-center d-flex justify-content-center"}>
                <Button className="btn-success m-2 circle-btn"
                        onClick={() => changeScore(1, 0)}>+1</Button>
                <div>
                    <h5>{localScore}<sup>{results.filter(set => set.local>set.visit).length}</sup></h5>
                    <div>Mariano Moreno</div>
                </div>
                <div>
                    vs
                </div>
                <div>
                    <h5>{visitScore}<sup>{results.filter(set => set.local<set.visit).length}</sup></h5>
                    <div>{gameName}</div>
                </div>
                <Button className="btn-danger m-2 circle-btn"
                        onClick={() => changeScore(0, 1)}>+1</Button>
            </div>
            <Row>
                <a href={"/EstadisticasVoley/#cambios"} className={"btn btn-primary ms-3 col-2 col-sm-1"}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20"
                         viewBox="0 0 640 512">
                        <path fill="#ffffff"
                              d="M64 64a64 64 0 1 1 128 0A64 64 0 1 1 64 64zM25.9 233.4C29.3 191.9 64 160 105.6 160h44.8c27 0 51 13.4 65.5 34.1c-2.7 1.9-5.2 4-7.5 6.3l-64 64c-21.9 21.9-21.9 57.3 0 79.2L192 391.2V464c0 26.5-21.5 48-48 48H112c-26.5 0-48-21.5-48-48V348.3c-26.5-9.5-44.7-35.8-42.2-65.6l4.1-49.3zM448 64a64 64 0 1 1 128 0A64 64 0 1 1 448 64zM431.6 200.4c-2.3-2.3-4.9-4.4-7.5-6.3c14.5-20.7 38.6-34.1 65.5-34.1h44.8c41.6 0 76.3 31.9 79.7 73.4l4.1 49.3c2.5 29.8-15.7 56.1-42.2 65.6V464c0 26.5-21.5 48-48 48H496c-26.5 0-48-21.5-48-48V391.2l47.6-47.6c21.9-21.9 21.9-57.3 0-79.2l-64-64zM272 240v32h96V240c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l64 64c9.4 9.4 9.4 24.6 0 33.9l-64 64c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2V336H272v32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2z"/>
                    </svg>
                </a>

            </Row>
            <Modal show={showChangeSetModal}>
                <Modal.Header>
                    <strong className="me-auto">Fin de set!</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className={"text-center d-flex justify-content-around"}>
                        <div>
                            <h5>{localScore}</h5>
                            <div>Mariano Moreno</div>
                        </div>
                        <div>
                            <h5>{visitScore}</h5>
                            <div>{gameName}</div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"outline-secondary"}>Corregir marcador</Button>
                    <Button variant={"primary text-light"} onClick={startNewSet}>Empezar otro set</Button>
                </Modal.Footer>
            </Modal>
            <StatsInput players={players} onAddStats={handleAddStats}/>
        </div>
    );
}

export default ComputeStatistics;

