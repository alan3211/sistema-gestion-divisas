import {consultaAlarmas} from "../../../../../../services/pld-services";
import {encryptRequest} from "../../../../../../utils";

export const AlarmasPLD =  ({item,index,deps}) => {

    const onHandleDetalleAlarma = async () => {

        const valores = {
            alarma: 2,
            numero_usuario: item["No Usuario"],
        }
        const encryptedData = encryptRequest(valores);
        const response =  await consultaAlarmas(encryptedData);
        deps.setDataAlertaDetalle(response)
        deps.setIsDetailShow(true)
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Ver Detalle Alarma"
                    onClick={onHandleDetalleAlarma}>
                <i className="bi bi-folder"></i>
            </button>
        </td>
    );
}