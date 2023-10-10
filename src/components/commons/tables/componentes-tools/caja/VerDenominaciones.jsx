import {encryptRequest} from "../../../../../utils";
import {muestraDenominaciones} from "../../../../../services/tools-services";

export const VerDenominaciones =  ({item, index,deps}) => {

    const getDenominaciones = async () => {
        console.log(deps.resetForm)
        if(deps.resetForm) deps.resetForm();
        deps.setMoneda(item.Moneda);
        const values = {
            usuario: item.Caja,
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
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip" disabled={parseInt(item['No Billetes']) === 0}
                    onClick={getDenominaciones}
                    data-bs-placement="top" title="Ver Denominaciones">
                <i className="bi bi-eye"></i>
            </button>
        </td>
    );
}