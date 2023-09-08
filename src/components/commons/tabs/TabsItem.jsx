import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import {TesoreriaContext} from "../../../context/tesoreria/TesoreriaContext";

export const TabsItem = ({name,icon,id,pestania,defecto}) => {

    const {changePestania} = useContext(CargaTipoCambioContext);

    return (
        <li className="nav-item flex-fill" role="presentation">
            <button className={`nav-link w-100 ${defecto && 'active'}`} id={`${id}-tab`} data-bs-toggle="tab"
                    data-bs-target="#bordered-justified-home" type="button" role="tab"
                    aria-controls={id} aria-selected="true" onClick={() => changePestania(pestania)}>
                <i className={icon}></i>
                <strong>{name}</strong>
            </button>
        </li>
    )
}