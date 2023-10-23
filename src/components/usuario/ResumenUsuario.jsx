import {dataG} from "../../App";

export const ResumenUsuario = () => {
    return (<>
        <h5 className="card-title">Dirección de la Sucursal</h5>
        <p className="small fst-italic">
            {dataG.direccion}
        </p>

        <h5 className="card-title">Detales del perfil</h5>

        <ul className="list-group">
            <li className="list-group-item">Nombre Completo: <strong>{dataG.username}</strong></li>
            <li className="list-group-item">Sucursal Perteneciente: <strong>{dataG.nombre_sucursal}</strong></li>
            <li className="list-group-item">Perfil: <strong>{dataG.perfil}</strong></li>
        </ul>
    </>);
}