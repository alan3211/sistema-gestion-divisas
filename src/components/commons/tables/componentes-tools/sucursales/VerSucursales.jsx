import {dataG} from "../../../../../App";
import {encryptRequest} from "../../../../../utils";
import {getResumenSucursales} from "../../../../../services/operacion-tesoreria";

export const VerSucursales =  ({item,index,deps}) => {

    const onHandleSucursal = async () => {

            const valores = {
                usuario: item["Usuario Consulta"],
                sucursal: item.Sucursal,
            }
            const encryptedData = encryptRequest(valores);
            const response =  await getResumenSucursales(encryptedData);
            deps.setDataSucursal(response)
            deps.setShowSucursal(true)
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Ver Sucursal"
            onClick={onHandleSucursal}>
                <span className="badge text-white"><i className="ri ri-store-2-fill"></i></span>
                {item["Sucursal"]}
            </button>
        </td>
    );
}