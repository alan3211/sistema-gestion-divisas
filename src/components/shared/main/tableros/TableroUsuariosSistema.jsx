import {encryptRequest, formattedDate} from "../../../../utils";
import {useEffect, useState} from "react";
import {getSucursalUsuarios} from "../../../../services/inicio-services";
import {TableComponent} from "../../../commons/tables";

export const TableroUsuariosSistema = () => {

    const options = {
        showMostrar:true,
        paginacion: true,
        buscar:true,
        tools:[
            {columna:"Usuarios",tool:"usuarios-sistema"},
            {columna:"Operacion",tool:"operacion-estatus"},
        ],
        filters:[
            {columna:"Monto",filter:'currency'},
            {columna:"Monto Entregado",filter:'currency'},
        ]
    }

    const [activo,setActivo] = useState(false);
    const [dataSucUsu,setDataSucUsu] = useState([]);


    useEffect(() => {

        const valores = {
            opcion: 1,
            sucursal: '',
        }

        const encryptedData = encryptRequest(valores);

        const getSucursales = async (data) => {
            const response = await getSucursalUsuarios(data);
            setActivo(true);
            setDataSucUsu(response);
        }

        getSucursales(encryptedData);

    }, []);

    return (
        <div className="row">
            <div className="card recent-sales overflow-auto">
                <div className="col-12">
                    <div className="card-body">
                        <h5 className="card-title">
                            <i className="bi bi-person-bounding-box me-2"></i>
                            Usuarios <span>|  {formattedDate}</span>
                        </h5>
                        {
                            activo && (
                                <TableComponent data={dataSucUsu} options={options}/>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}