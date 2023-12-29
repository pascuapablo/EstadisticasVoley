import React from 'react';
import '../css/app.scss'
import {utils, writeFile} from 'xlsx';


function StatsResults({players, stats,gameName}) {

    const downloadStats = () => {
        var tbl = document.getElementById('sheetjs');
        /* create a workbook */
        var wb = utils.table_to_book(tbl);
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        /* export to file */
        writeFile(wb, `${date}_vs_${gameName}.xlsx`);
    }

    return (
        <div className="col m-3 ">
            <div className={"row my-4 text-center"}>
                <h5>
                    Mariano Moreno vs {gameName}
                </h5>
            </div>
            <div className="table-responsive">

                <div className={"d-flex justify-content-end"}>
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
                        .map((player, index) => (
                            <tr
                                key={index}
                                className="table-row"
                            >
                                <td>{player.name}</td>

                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_++").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_+").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_-").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_saque_ganado").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion" && stat.pointValue === "recepcion_ace").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "recepcion").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_++").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_+").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_-").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_error_de_bloqueo").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque" && stat.pointValue === "ataque_error").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "ataque").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_++").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_+").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_-").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_error_de_bloqueo").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque" && stat.pointValue === "contraataque_error").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "contra-ataque").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_+").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_def").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "bloqueo" && stat.pointValue === "bloqueo_-").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "bloqueo").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_ace").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_+").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_-").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "saque" && stat.pointValue === "saque_error").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "saque").length}</td>
                                <td> {stats.filter(stat => stat.playerName === player.name && stat.action === "error_por_regla").length}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default StatsResults;
