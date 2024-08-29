import React, {useState} from 'react';
import '../css/app.scss'
import {utils, writeFile} from 'xlsx';


function StatsResults({players, stats, gameName}) {

    const scoreValueMap = {
        "recepcion_++": 0,
        "recepcion_+": 0,
        "recepcion_-": 0,
        "recepcion_saque_ganado": -1,
        "recepcion_ace": -1,
        "ataque_++": 1,
        "ataque_+": 0,
        "ataque_-": 0,
        "ataque_error_de_bloqueo": -1,
        "ataque_error": -1,
        "contraataque_++": 1,
        "contraataque_+": 0,
        "contraataque_-": 0,
        "contraataque_error_de_bloqueo": -1,
        "contraataque_error": -1,
        "bloqueo_+": 1,
        "bloqueo_def": 0,
        "bloqueo_-": -1,
        "saque_ace": 1,
        "saque_+": 0,
        "saque_-": 0,
        "saque_error": -1
    };

    const [statsOfSelectedSet, setStatsOfSelectedSet] = useState(stats)
    const [selectedSet, setSelectedSet] = useState("all")
    const playedSets = (stats.length ===0)? [] : [...Array(Math.max(...stats.map(stat => stat.setNumber))).keys()] ;
    function buildScore(results, localScore, visitScore) {
        const finalResult = results.map((result, index) => {
            return [
                `Set ${index + 1}`,
                result.local.toString(),
                result.visit.toString()
            ]
        })
        finalResult.push(["Set " + (finalResult.length + 1), localScore.toString(), visitScore.toString()])
        return finalResult
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const downloadStats = async () => {

        const finalResult = buildScore(JSON.parse(localStorage.getItem("results")), localStorage.getItem("localScore"), localStorage.getItem("visitScore"))

        /* create a workbook */
        const wb = utils.book_new();
        let worksheet = utils.json_to_sheet([
            ["", "Mariano Moreno", gameName], ...finalResult
        ], {skipHeader: true});

        utils.book_append_sheet(wb, worksheet, 'Resultado');

        filterStatsBaseOnSelectedValue({target: {value: "all"}});
        await sleep(200);

        const tbl = document.getElementById('sheetjs');
        utils.book_append_sheet(wb, utils.table_to_sheet(tbl), "Estadisticas totales")
        for (let i = 0; i < playedSets.length; i++) {
            filterStatsBaseOnSelectedValue({target: {value: i}});
            await sleep(200);
            const tbl = document.getElementById('sheetjs');
            utils.book_append_sheet(wb, utils.table_to_sheet(tbl), "Set " + (i + 1))

        }
        filterStatsBaseOnSelectedValue({target: {value: selectedSet}});


        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        /* export to file */
        writeFile(wb, `${date}_vs_${gameName}.xlsx`);
    }


    function filterStatsBaseOnSelectedValue(e) {
        setSelectedSet(e.target.value);
        if (e.target.value === "all") {
            setStatsOfSelectedSet(stats);
            return
        }

        const filteredStats = stats.filter(stat => {
            return stat.setNumber === (parseInt(e.target.value) + 1)
        });
        setStatsOfSelectedSet(filteredStats)
    }

    return (<div className="col m-3 ">
        <div className={"row my-4 text-center"}>
            <h5>
                Mariano Moreno vs {gameName}
            </h5>
        </div>
        <div className="table-responsive">

            <div className={"d-flex justify-content-between align-items-center"}>
                <div>
                    <select className="form-select" aria-label="Default select example" defaultValue="all"
                            onChange={filterStatsBaseOnSelectedValue}>
                        <option value="all">Todos los sets</option>
                        {
                            playedSets.map((a, index) => {
                                return <option key={index} value={index}>Set {index + 1}</option>
                            })
                        }
                    </select>
                </div>
                <button className={"btn btn-primary text-light my-3 "} onClick={downloadStats}>Descargar</button>
            </div>

            <table className="table table-bordered align-middle text-center" id={"sheetjs"}>
                <thead className="table-light">
                <tr>
                    <th rowSpan="2">Jugadores</th>
                    <th colSpan="6">Recepcion</th>
                    <th colSpan="6">Ataque</th>
                    <th colSpan="6">Contraataque</th>
                    <th colSpan="4">Bloqeo</th>
                    <th colSpan="5">Saque</th>
                    <th rowSpan="2">Error por regla</th>
                </tr>
                <tr>
                    <th>++</th>
                    <th>+</th>
                    <th>-</th>
                    <th>Saque ganado</th>
                    <th>Ace</th>
                    <th>Total</th>
                    <th>++</th>
                    <th>+</th>
                    <th>-</th>
                    <th>Err de bloqueo</th>
                    <th>Error</th>
                    <th>Total</th>
                    <th>++</th>
                    <th>+</th>
                    <th>-</th>
                    <th>Err de bloqueo</th>
                    <th>Error</th>
                    <th>Total</th>
                    <th>++</th>
                    <th>def</th>
                    <th>-</th>
                    <th>Total</th>
                    <th>Ace</th>
                    <th>+</th>
                    <th>-</th>
                    <th>Error</th>
                    <th>Total</th>

                </tr>
                </thead>
                <tbody>

                {players
                    .slice()
                    .filter((player) => stats.filter(stat => stat.playerName === player.name).length > 0)
                    .sort((a, b) => a.position.localeCompare(b.position))
                    .map((player, index) => (<tr
                        key={index}
                        className="table-row"
                    >
                        <td>{player.name}</td>

                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_++").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_+").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_-").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_saque_ganado").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_ace").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "recepcion").map(a => scoreValueMap[a.pointValue]).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_++").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_+").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_-").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_error_de_bloqueo").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_error").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "ataque").map(a => scoreValueMap[a.pointValue]).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_++").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_+").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_-").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_error_de_bloqueo").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_error").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque").map(a => scoreValueMap[a.pointValue]).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_+").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_def").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_-").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "bloqueo").map(a => scoreValueMap[a.pointValue]).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_ace").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_+").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_-").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_error").length}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "saque").map(a => scoreValueMap[a.pointValue]).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
                        <td> {statsOfSelectedSet.filter(stat => stat.playerName === player.name && stat.action === "error_por_regla").length}</td>

                    </tr>))}
                </tbody>
            </table>

        </div>
    </div>);
}

export default StatsResults;
