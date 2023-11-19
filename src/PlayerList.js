import React from 'react';
import {Button} from "react-bootstrap";

function PlayerList({ players, onToggleInCancha }) {
    return (
        <table className="table ">
            <thead>
            <tr>
                <th></th>
                <th>#</th>
                <th>Jugador</th>
                <th className={"text-center"}>En Cancha</th>
            </tr>
            </thead>
            <tbody>

            {players.map((player, index) => (
                <tr key={index}>
                    <td><Button  variant="" className={"text-secondary"} size="sm"><i className="bi bi-pencil"></i>
                    </Button></td>

                    <td>{player.number}</td>
                    <td>{player.name} ({player.position})</td>
                    <td className={"text-center"}>
                        <input
                            type="checkbox"
                            checked={player.isInCancha }
                            onChange={(e) => {
                                onToggleInCancha(index, e.target.checked);
                            }}
                            className={"form-check-input"}
                        />
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default PlayerList;
