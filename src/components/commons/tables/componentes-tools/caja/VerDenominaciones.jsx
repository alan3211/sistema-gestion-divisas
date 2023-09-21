import {useEffect} from "react";
import {encryptRequest} from "../../../../../utils";
import {muestraDenominaciones} from "../../../../../services/tools-services";

export const VerDenominaciones =  ({item, index,deps}) => {

    const getDenominaciones = async () => {
        deps.setMoneda(item.Moneda);
        const values = {
            usuario: item.Usu,
            fecha:item.Fecha,
            moneda:item.Moneda
        }

        const encryptedData = encryptRequest(values);

        const response = await muestraDenominaciones(encryptedData);
        deps.setShowDetalle(true);
        deps.setDataDenominacion(response);
    }


    return (
        <td key={index} className="text-center">
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip"
                    onClick={getDenominaciones}
                    data-bs-placement="top" title="Ver Denominaciones">
                <i className="bi bi-eye"></i>
            </button>
        </td>
    );
}