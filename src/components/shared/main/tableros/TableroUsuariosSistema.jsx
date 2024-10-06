import {formattedDate} from "../../../../utils";
import {TableComponent} from "../../../commons/tables";
import {useGetUsuariosSistema} from "../../../../hook/useGetUsuariosSistema";

export const TableroUsuariosSistema = () => {

   const { options,activo,dataSucUsu} = useGetUsuariosSistema({opcion: 1, sucursal: '',});

    return (
        <div className="row">
            <div className="card recent-sales overflow-auto">
                <div className="col-12">
                    <div className="card-body">
                        <h5 className="card-title">
                            <i className="bi bi-person-bounding-box me-2"></i>
                            Usuarios <span>|  {formattedDate()}</span>
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