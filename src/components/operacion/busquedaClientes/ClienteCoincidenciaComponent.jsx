import {TableComponent} from "../../commons/tables";
import {CardLayout} from "../../commons";

export const ClienteCoincidenciaComponent = ({dataClientes,showAddCliente,addCliente,setDataClientes,setShowCliente,setMessageActive}) =>{

    const options = {
        showMostrar:true,
        excel:true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna:"Selecciona",tool:'selecciona-cliente',deps:{setDataClientes,setShowCliente,setMessageActive}},
        ]
    }

    return(
        <CardLayout title="Usuarios con coincidencias" icon="bx bxs-user-detail p-2">
            <TableComponent data={dataClientes} options={options}/>
            {
                showAddCliente &&
                (
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3">
                            <div className="form-floating d-flex align-items-center h-100">
                                <button
                                    type="button"
                                    className="m-2 btn btn-success d-grid gap-2"
                                    onClick={addCliente}
                                >
                                  <span className="bi bi-person-plus-fill me-2" role="status" aria-hidden="true">
                                      <span className="ms-2"><strong>NUEVO USUARIO</strong></span>
                                  </span>
                                </button>
                            </div>
                        </div>

                    </div>

                )
            }
        </CardLayout>
    );
}