import React, {useState, useRef} from 'react';
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
    const [activeIdx, setActiveIdx] = useState(0)
    const pagerRef = useRef(null)

    const handlePagerScroll = (e) => {
        const w = e.target.clientWidth || 1;
        setActiveIdx(Math.round(e.target.scrollLeft / w));
    };
    const goToSlide = (i) => {
        const el = pagerRef.current;
        if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    };

    // Config de categorías para la vista compacta (mobile)
    const CATS = [
        { key: "recepcion", label: "Recepción",    action: "recepcion",     hasTotal: true,  cols: [
            { h: "++", pv: "recepcion_++" }, { h: "+", pv: "recepcion_+" }, { h: "-", pv: "recepcion_-" },
            { h: "S.gan", pv: "recepcion_saque_ganado" }, { h: "Ace", pv: "recepcion_ace" } ] },
        { key: "ataque", label: "Ataque",          action: "ataque",        hasTotal: true,  cols: [
            { h: "++", pv: "ataque_++" }, { h: "+", pv: "ataque_+" }, { h: "-", pv: "ataque_-" },
            { h: "E/bloq", pv: "ataque_error_de_bloqueo" }, { h: "Error", pv: "ataque_error" } ] },
        { key: "contra", label: "Contra",          action: "contra-ataque", hasTotal: true,  cols: [
            { h: "++", pv: "contraataque_++" }, { h: "+", pv: "contraataque_+" }, { h: "-", pv: "contraataque_-" },
            { h: "E/bloq", pv: "contraataque_error_de_bloqueo" }, { h: "Error", pv: "contraataque_error" } ] },
        { key: "bloqueo", label: "Bloqueo",        action: "bloqueo",       hasTotal: true,  cols: [
            { h: "++", pv: "bloqueo_+" }, { h: "def", pv: "bloqueo_def" }, { h: "-", pv: "bloqueo_-" } ] },
        { key: "saque", label: "Saque",            action: "saque",         hasTotal: true,  cols: [
            { h: "Ace", pv: "saque_ace" }, { h: "+", pv: "saque_+" }, { h: "-", pv: "saque_-" }, { h: "Error", pv: "saque_error" } ] },
        { key: "error", label: "Errores",          action: "error_por_regla", hasTotal: false, cols: [
            { h: "Err x regla", pv: "error_por_regla_error" } ] },
    ];

    const cnt = (name, pv) => statsOfSelectedSet.filter(s => s.playerName === name && s.pointValue === pv).length;
    const tot = (name, action) => statsOfSelectedSet
        .filter(s => s.playerName === name && s.action === action)
        .reduce((acc, s) => acc + (scoreValueMap[s.pointValue] || 0), 0);

    // Combinado de todo el equipo (sin separar por jugador)
    const teamCnt = (pv) => statsOfSelectedSet.filter(s => s.pointValue === pv).length;
    const teamTot = (action) => statsOfSelectedSet
        .filter(s => s.action === action)
        .reduce((acc, s) => acc + (scoreValueMap[s.pointValue] || 0), 0);

    const playersWithStats = players.slice()
        .filter(p => stats.some(s => s.playerName === p.name))
        .sort((a, b) => a.position.localeCompare(b.position));

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

    // ── Render helpers para cada "página" del carrusel ──
    const resumenTable = (
        <div className="stats-compact-wrap">
            <table className="stats-compact">
                <thead>
                    <tr>
                        <th className="col-name">Fundamento</th>
                        <th>Acciones</th>
                        <th className="col-total">Valoración</th>
                    </tr>
                </thead>
                <tbody>
                    {CATS.map(c => {
                        const acc = statsOfSelectedSet.filter(s => s.action === c.action).length;
                        const v = c.hasTotal ? teamTot(c.action) : null;
                        return (
                            <tr key={c.key}>
                                <td className="col-name">{c.label}</td>
                                <td className={acc ? "" : "zero"}>{acc}</td>
                                <td className={`col-total ${v > 0 ? "pos" : v < 0 ? "neg" : ""}`}>
                                    {v === null ? "—" : v > 0 ? `+${v}` : v}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="team-row">
                        <td className="col-name">TOTAL</td>
                        <td>{statsOfSelectedSet.length}</td>
                        {(() => {
                            const g = CATS.filter(c => c.hasTotal).reduce((acc, c) => acc + teamTot(c.action), 0);
                            return (
                                <td className={`col-total ${g > 0 ? "pos" : g < 0 ? "neg" : ""}`}>
                                    {g > 0 ? `+${g}` : g}
                                </td>
                            );
                        })()}
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    const catTable = (cat, catP) => (
        <div className="stats-compact-wrap">
            <table className="stats-compact">
                <thead>
                    <tr>
                        <th className="col-name">Jugador</th>
                        {cat.cols.map(col => <th key={col.pv}>{col.h}</th>)}
                        {cat.hasTotal && <th className="col-total">Total</th>}
                    </tr>
                </thead>
                <tbody>
                    {catP.map(p => {
                        const t = tot(p.name, cat.action);
                        return (
                            <tr key={p.name}>
                                <td className="col-name">{p.name} <span className="num">({p.number})</span></td>
                                {cat.cols.map(col => {
                                    const v = cnt(p.name, col.pv);
                                    return <td key={col.pv} className={v ? "" : "zero"}>{v}</td>;
                                })}
                                {cat.hasTotal && (
                                    <td className={`col-total ${t > 0 ? "pos" : t < 0 ? "neg" : ""}`}>
                                        {t > 0 ? `+${t}` : t}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="team-row">
                        <td className="col-name">EQUIPO</td>
                        {cat.cols.map(col => <td key={col.pv}>{teamCnt(col.pv)}</td>)}
                        {cat.hasTotal && (() => {
                            const tt = teamTot(cat.action);
                            return (
                                <td className={`col-total ${tt > 0 ? "pos" : tt < 0 ? "neg" : ""}`}>
                                    {tt > 0 ? `+${tt}` : tt}
                                </td>
                            );
                        })()}
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    // Arma las páginas: Resumen + cada fundamento que tenga registros
    const slides = stats.length === 0 ? [] : [
        { key: "resumen", label: "Resumen del equipo", node: resumenTable },
        ...CATS.map(cat => {
            const catP = playersWithStats.filter(p =>
                statsOfSelectedSet.some(s => s.playerName === p.name && s.action === cat.action));
            return catP.length ? { key: cat.key, label: cat.label, node: catTable(cat, catP) } : null;
        }).filter(Boolean),
    ];
    const safeIdx = Math.min(activeIdx, Math.max(0, slides.length - 1));

    return (<div className="results-page">
        {/* Encabezado: título + exportar (compacto) */}
        <div className="results-head">
            <h2 className="results-title">Mariano Moreno <span>vs</span> {gameName}</h2>
            <button className="results-download" onClick={downloadStats} title="Exportar a Excel">
                <i className="bi bi-download"></i>
            </button>
        </div>

        {/* Selector de set: solo si hay más de uno */}
        {playedSets.length > 1 && (
            <select className="form-select results-set" defaultValue="all" onChange={filterStatsBaseOnSelectedValue}>
                <option value="all">Todos los sets</option>
                {playedSets.map((a, index) => (
                    <option key={index} value={index}>Set {index + 1}</option>
                ))}
            </select>
        )}

        {/* CARRUSEL HORIZONTAL: una página por fundamento (Resumen primero) */}
        {slides.length === 0 ? (
            <div className="results-empty">Todavía no hay estadísticas cargadas.</div>
        ) : (
            <>
                <div className="pager-label">{slides[safeIdx].label}</div>
                <div className="cat-pager" ref={pagerRef} onScroll={handlePagerScroll}>
                    {slides.map(s => (
                        <div className="cat-slide" key={s.key}>{s.node}</div>
                    ))}
                </div>
                <div className="pager-dots">
                    {slides.map((s, i) => (
                        <button
                            key={s.key}
                            className={i === safeIdx ? "active" : ""}
                            onClick={() => goToSlide(i)}
                            aria-label={s.label}
                        />
                    ))}
                </div>
            </>
        )}

        {/* Tabla completa (oculta) — usada solo para exportar a Excel */}
        <div className="export-only" aria-hidden="true">
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
