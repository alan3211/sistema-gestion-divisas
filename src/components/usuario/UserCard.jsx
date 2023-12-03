
import {dataG} from "../../App";
import {FormatoMoneda} from "../../utils";
import {Avatar} from "flowbite-react";

export const UserCard = () => {

    return(
        <div className="card">
            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                <Avatar
                    size="xl"
                    rounded
                />
                <h2>{dataG.username}</h2>
                <h3>{dataG.perfil}</h3>
                <h5 className="card-title">Detalle Sucursal</h5>
                <ul className="list-group">
                    <li className="list-group-item">
                        <i className="bi bi-hash me-2 text-success"></i>
                        {dataG.sucursal}
                    </li>
                    <li className="list-group-item">
                        <i className="bi bi-shop me-2 text-warning"></i>
                        {dataG.nombre_sucursal}
                    </li>
                    <li className="list-group-item">
                        <i className="bi bi-collection me-1 text-primary"></i>
                        Limite Diario en USD a la compra <strong>{FormatoMoneda(parseFloat(dataG.limite_diario))}</strong>
                    </li>
                    <li className="list-group-item">
                        <i className="bi bi-collection me-1 text-danger"></i>
                        Limite Mensual en USD a la compra <strong>{FormatoMoneda(parseFloat(dataG.limite_mensual))}</strong>
                    </li>
                </ul>
            </div>
        </div>
    );
}